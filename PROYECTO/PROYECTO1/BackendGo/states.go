package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"strconv"
)

type State_process struct {
	Id     int64 `json:"id"`
	Pid    int   `json:"pid"`
	State  int   `json:"state_process"`
	Active bool  `json:"active"`
}

var process *exec.Cmd

const STATE_NEW = 1
const STATE_RUNNING = 2
const STATE_WAITING = 3
const STATE_READY = 4
const STATE_TERMINATED = 5
const ACTIVE = true

func GetCurrentProcess(w http.ResponseWriter, r *http.Request) {
	var state_list []State_process
	query := `SELECT id, pid, state_process, active 
	FROM historyprocess 
	WHERE active = true 
	ORDER BY id ASC`
	result, err := db.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // Al igual que arriba, manejamos el error.
	}

	for result.Next() {
		var state State_process
		err = result.Scan(&state.Id, &state.Pid, &state.State, &state.Active)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return // Al igual que arriba, manejamos el error.
		}
		state_list = append(state_list, state)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(state_list)
}

func SaveState(pid int, state int, active bool) int64 {
	query := `INSERT INTO historyprocess(pid, state_process, active) VALUES (?,?,?);`
	res, err := db.Exec(query, pid, state, active)
	if err != nil {
		fmt.Println(err)
		return 0
	}
	id, err := res.LastInsertId()
	if err != nil {
		fmt.Println(err)
		return 0
	}
	return id
}

func UpdateActiveProcess(active bool, pid int) bool {
	query := `update historyprocess set active = ? where pid = ?;`
	_, err := db.Exec(query, active, pid)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func UpdateDeactiveProcess() bool {
	query := `update historyprocess set active = false where active = true;`
	_, err := db.Exec(query)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func StartProcess(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("sleep", "infinity")
	err := cmd.Start()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // No se retorna ningún valor, solo se maneja el error.
	}

	process = cmd
	UpdateDeactiveProcess()
	fmt.Printf("Proceso iniciado con PID: %d y estado en espera\n", process.Process.Pid)

	pid := cmd.Process.Pid
	id_state := SaveState(pid, STATE_NEW, ACTIVE)
	SaveState(pid, STATE_READY, ACTIVE)
	SaveState(pid, STATE_RUNNING, ACTIVE)
	state := State_process{
		Id:     id_state,
		Pid:    pid,
		State:  STATE_RUNNING,
		Active: ACTIVE,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(state)
}

func StopProcess(w http.ResponseWriter, r *http.Request) {
	pidStr := r.URL.Query().Get("pid")
	if pidStr == "" {
		http.Error(w, "Parámetro 'pid' requerido\n", http.StatusBadRequest)
		return
	}

	pid, err := strconv.Atoi(pidStr)
	if err != nil {
		http.Error(w, "Parámetro 'pid' debe ser un número entero\n", http.StatusBadRequest)
		return
	}

	// Enviar señal SIGSTOP al proceso con el PID proporcionado
	cmd := exec.Command("kill", "-SIGSTOP", strconv.Itoa(pid))
	err = cmd.Run()
	if err != nil {
		UpdateDeactiveProcess()
		http.Error(w, fmt.Sprintf("No se pudo detener el proceso con pid %d\n", pid), http.StatusInternalServerError)
		return
	}

	fmt.Printf("Proceso con pid %d detenido\n", pid)

	SaveState(pid, STATE_WAITING, ACTIVE)
	SaveState(pid, STATE_READY, ACTIVE)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(true)
}

func ResumeProcess(w http.ResponseWriter, r *http.Request) {
	pidStr := r.URL.Query().Get("pid")
	if pidStr == "" {
		http.Error(w, "Parámetro 'pid' requerido\n", http.StatusBadRequest)
		return
	}

	pid, err := strconv.Atoi(pidStr)
	if err != nil {
		http.Error(w, "Parámetro 'pid' debe ser un número entero\n", http.StatusBadRequest)
		return
	}

	// Enviar señal SIGCONT al proceso con el PID proporcionado
	cmd := exec.Command("kill", "-SIGCONT", strconv.Itoa(pid))
	err = cmd.Run()
	if err != nil {
		UpdateDeactiveProcess()
		http.Error(w, fmt.Sprintf("No se pudo reanudar el proceso con pid %d\n", pid), http.StatusInternalServerError)
		return
	}

	fmt.Printf("Proceso con pid %d reanudado\n", pid)
	w.Header().Set("Content-Type", "application/json")

	SaveState(pid, STATE_RUNNING, ACTIVE)

	json.NewEncoder(w).Encode(true)
}

func KillProcess(w http.ResponseWriter, r *http.Request) {
	pidStr := r.URL.Query().Get("pid")
	if pidStr == "" {
		http.Error(w, "Se requiere el parámetro 'pid'\n", http.StatusBadRequest)
		return
	}

	pid, err := strconv.Atoi(pidStr)
	if err != nil {
		http.Error(w, "El parámetro 'pid' debe ser un número entero\n", http.StatusBadRequest)
		return
	}

	// Enviar señal SIGCONT al proceso con el PID proporcionado
	cmd := exec.Command("kill", "-9", strconv.Itoa(pid))
	err = cmd.Run()
	if err != nil {
		UpdateDeactiveProcess()
		http.Error(w, fmt.Sprintf("Error al intentar terminar el proceso con PID %d\n", pid), http.StatusInternalServerError)
		return
	}

	fmt.Printf("Proceso con pid %d ha terminado\n", pid)
	w.Header().Set("Content-Type", "application/json")

	SaveState(pid, STATE_TERMINATED, ACTIVE)

	json.NewEncoder(w).Encode(true)
}
