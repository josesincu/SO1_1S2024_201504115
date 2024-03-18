package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type Record struct {
	Id   int     `json:"id"`
	Ram  bool    `json:"ram"`
	Free float64 `json:"free"`
	Busy float64 `json:"busy"`
}

var db = MysqlConnection()

func MysqlConnection() *sql.DB {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	connString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)

	conexion, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Conexion con MySQL Correcta")
	}
	return conexion
}

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Establecer cabeceras
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Si es una solicitud preflight, terminamos aquí
		if r.Method == "OPTIONS" {
			return
		}
		// Llamar al siguiente manejador
		next(w, r)
	}
}

func Logger(handler http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		handler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s\n", r.Method, r.RequestURI, time.Since(start))
	})
}

func HolaMundo(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "¡Hola, Mundo!")
}

func InsertRecord(ram bool, free float64, busy float64) bool {
	query := `INSERT INTO record(ram, free, busy) VALUES (?,?,?);`
	_, err := db.Exec(query, ram, free, busy)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func GetRecords(ram bool) []Record {
	var lista []Record
	query := "select * from ( SELECT * FROM so1proyecto1.record where ram = ? order by id desc limit 100 ) AS subquery order by id asc;"
	result, err := db.Query(query, ram)
	if err != nil {
		fmt.Println(err)
		return lista
	}

	for result.Next() {
		var logc Record

		err = result.Scan(&logc.Id, &logc.Ram, &logc.Free, &logc.Busy)
		if err != nil {
			fmt.Println(err)
		}
		lista = append(lista, logc)
	}
	return lista
}

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error al cargar las variables de entorno")
	}

	http.HandleFunc("/", Logger(enableCORS(HolaMundo)))

	// Agrega esta línea para manejar el endpoint /api/ram
	http.HandleFunc("/api/ram", Logger(enableCORS(GetDataRam)))
	http.HandleFunc("/api/ram-records", Logger(enableCORS(RamRecords)))
	http.HandleFunc("/api/cpu", Logger(enableCORS(GetCPUData)))
	http.HandleFunc("/api/cpu-records", Logger(enableCORS(CpuRecords)))
	http.HandleFunc("/api/cpu-processes", Logger(enableCORS(GetProcesses)))

	http.HandleFunc("/api/process-current", Logger(enableCORS(GetCurrentProcess)))
	http.HandleFunc("/api/process-start", Logger(enableCORS(StartProcess)))
	http.HandleFunc("/api/process-stop", Logger(enableCORS(StopProcess)))
	http.HandleFunc("/api/process-resume", Logger(enableCORS(ResumeProcess)))
	http.HandleFunc("/api/process-kill", Logger(enableCORS(KillProcess)))

	port := os.Getenv("PORT_HOST")
	fmt.Println("Servidor escuchando en el puerto", port)

	http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}
