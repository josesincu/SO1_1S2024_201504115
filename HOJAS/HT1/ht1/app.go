package main

import (
	"context"
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// GreetMemoriaUsada returns a memory used

func (a *App) GreetMemoriaUsada() float32 {

	var totalMemoria float32 = 3000862.0
	var totalPorcentaje float32 = 100.0
	var totalPorcentajeLibre float32 = (float32(obtenerLibre()) * totalPorcentaje) / totalMemoria
	var totalPorcentajeUsada float32 = totalPorcentaje - totalPorcentajeLibre
	//println(obtenerLibre())
	//print("Memoria Libre:")
	//println(totalPorcentajeLibre)
	//print("Memoria Usada:")
	//println(totalPorcentajeUsada)
	return totalPorcentajeUsada

}

// GreetMemoriaUsada returns a memory used

func (a *App) GreetMemoriaLibre() float32 {

	var totalMemoria float32 = 3000862.0
	var totalPorcentaje float32 = 100.0
	var totalPorcentajeLibre float32 = (float32(obtenerLibre()) * totalPorcentaje) / totalMemoria
	return totalPorcentajeLibre
}

// Return memoria free
func obtenerLibre() int {
	var Arg1 string = "cat"
	var Arg2 string = "/proc/ram_201504115"
	var Out strings.Builder

	cmd := exec.Command(Arg1, Arg2)
	cmd.Stdout = &Out

	err := cmd.Run()

	if err != nil {

		fmt.Println("Error no se puede correr comando")
		return -1
	}
	MemoriaLibre, err := strconv.Atoi(Out.String())
	if err != nil {
		fmt.Println("Error al convertir string a numero")
		return -1
	}
	return MemoriaLibre
}
