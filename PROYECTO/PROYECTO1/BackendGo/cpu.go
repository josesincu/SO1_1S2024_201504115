package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"os/exec"
)

type ProcessChild struct {
	Pid    int    `json:"pid"`
	Name   string `json:"name"`
	State  int    `json:"state"`
	Father int    `json:"pidPadre"`
}

type Process struct {
	Pid   int            `json:"pid"`
	Name  string         `json:"name"`
	User  int            `json:"user"`
	State int            `json:"state"`
	Ram   int            `json:"ram"`
	Child []ProcessChild `json:"child"`
}

type CPUData struct {
	CpuTotal  float64   `json:"cpu_total"`
	Percent   float64   `json:"cpu_porcentaje"`
	NumCpu    int       `json:"num_cpu"`
	Processes []Process `json:"processes"`
}

type CPUDataReturn struct {
	Used      float64   `json:"used"`
	Notused   float64   `json:"notused"`
	NumCpu    int       `json:"num_cpu"`
	Processes []Process `json:"processes"`
}

func InsetProcessesToBD(entrada []Process) bool {
	query := `INSERT INTO sysprocess (pid, name_process, user_process, state, ram)
		VALUES (?, ?, ?, ?, ?)
	ON DUPLICATE KEY UPDATE 
		name_process = ?, user_process = ?, state = ?, ram = ?;`

	query2 := `INSERT INTO sysprocess (pid, name_process, state, father_pid)
		VALUES (?, ?, ?, ?)
	ON DUPLICATE KEY UPDATE 
		name_process = ?, state = ?, father_pid = ?;`

	for _, process := range entrada {
		_, err := db.Exec(query, process.Pid, process.Name, process.User, process.State, process.Ram, process.Name, process.User, process.State, process.Ram)
		if err != nil {
			fmt.Println(err)
			return false
		}
		for _, child := range process.Child {
			_, err := db.Exec(query2, child.Pid, child.Name, child.State, child.Father, child.Name, child.State, child.Father)
			if err != nil {
				fmt.Println("No se pudo insertar", child.Pid, err)
			}
		}
	}
	return true
}

func GetCPUData(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_so1_1s2024")
	out, err := cmd.CombinedOutput()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // No se retorna ningún valor, solo se maneja el error.
	}

	var data CPUData
	var dataReturn CPUDataReturn
	err = json.Unmarshal(out, &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // Al igual que arriba, manejamos el error.
	}

	cpu_total := math.Abs(data.CpuTotal)
	percent := math.Abs(data.Percent)

	for cpu_total < percent {
		cpu_total = cpu_total * 10
	}

	dataReturn.Used = math.Round(percent*10000/cpu_total) / 100
	dataReturn.Notused = 100 - dataReturn.Used
	dataReturn.NumCpu = data.NumCpu

	go InsertRecord(false, dataReturn.Notused, dataReturn.Used)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dataReturn)
}

func GetProcesses(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_so1_1s2024")
	out, err := cmd.CombinedOutput()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // No se retorna ningún valor, solo se maneja el error.
	}

	var data CPUData
	err = json.Unmarshal(out, &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // Al igual que arriba, manejamos el error.
	}

	go InsetProcessesToBD(data.Processes)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Processes)
}

func CpuRecords(w http.ResponseWriter, r *http.Request) {
	lista := GetRecords(false)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lista)
}
