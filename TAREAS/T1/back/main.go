package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/rs/cors"
)

type Datos struct {
	Nombre string `json:"nombre"`
	Carnet string `json:"carnet"`
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/data", DatosHandler)

	// Configura CORS
	corsHandler := cors.Default().Handler(mux)

	port := ":2074"
	fmt.Printf("Escuchando en el puerto %s...\n", port)
	err := http.ListenAndServe(port, corsHandler)
	if err != nil {
		fmt.Println(err)
	}
}

func DatosHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("xD\n")
	datos := Datos{
		Nombre: "Jose Castro Sincu",
		Carnet: "201504115",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(datos); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
