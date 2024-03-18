import React, { useEffect, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';


function ProcessTree() {
    const [selectedOption, setSelectedOption] = useState('');
    const [optionsSelect, setOptionsSelect] = useState([]);
    const [processesData, setProcessesData] = useState([]);
    const [dataChart, setDataChart] = useState({
        nodes: new DataSet([{ id: 1, label: "SELECCIONA UN PROCESO PADRE :D" }]),
        edges: new DataSet([]),
    });

    const options = {
        layout: {
            hierarchical: {
                direction: 'UD', // Dirección: Arriba-Abajo. Usa LR para Izquierda-Derecha
                sortMethod: 'directed'
            },
        },
    };

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const redChild = (pid_child, procesess, nodes, edges) => {
        for (let process of procesess) {
            if (process.pid == pid_child) {
                if (!(process.child && process.child.length)) return;
                for (let child of process.child) {
                    nodes.push({ id: child.pid, label: `${child.name}\npid=${child.pid}` })
                    edges.push({ from: pid_child, to: child.pid })
                }
            }
        }
    }

    const getDatos = () => {

        let optionsSelect = [];
        let nodes = [];
        let edges = [];
        

        if (processesData.length) {
            if (selectedOption != "") {
                for (let process of processesData) {
                    if (process.pid == selectedOption) {
                        nodes.push({ id: process.pid, label: `${process.name}\npid=${process.pid}` })

                        if (process.child && process.child.length) {
                            for (let child of process.child) {
                                nodes.push({ id: child.pid, label: `${child.name}\npid=${child.pid}` })
                                edges.push({ from: process.pid, to: child.pid })
                                redChild(child.pid, processesData, nodes, edges)
                            }
                        }
                        break;
                    }
                }
            }
        }



        let losDatos = {
            nodes: new DataSet(nodes),
            edges: new DataSet(edges),
        }

        setDataChart(losDatos)
        // fetch("http://localhost:2024/api/cpu-processes")
        fetch("/api/cpu-processes")
            .then(response => response.json())
            .then(data => {
                const processes = data;
                setProcessesData(processes)
                let encontrado = false;
                for (let process of processes) {
                    encontrado = false;
                    for (let p1 of processes) {
                        if (p1.child && p1.child.length) {
                            for (let child of p1.child) {
                                if (child.pid == process.pid) {
                                    encontrado = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!encontrado) optionsSelect.push({ value: `${process.pid}`, text: `pid${process.pid} - ${process.name}` })
                }
                setOptionsSelect(optionsSelect)
                
            })
            .catch(err => { console.log(err) })
    }

    useEffect(() => {
        getDatos()
    }, [selectedOption]);


    useEffect(() => {
        const network = new Network(document.getElementById('mynetwork'), dataChart, options);
    })


    return (
        <>
            <div className='d-flex justify-content-center'>
                <div className='col-5'>
                    <h6 className='text-center'> Selecciona tu arbol de procesos</h6>
                    <div>
                        <select className="form-select" id="floatingSelect" value={selectedOption} onChange={handleChange}>
                            <option value="">Seleccionar</option> {/* Opción predeterminada */}
                            {optionsSelect.map((option, index) => (
                                <option key={option.value} value={option.value}>
                                    {index + 1 + ": " + option.text}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div id="mynetwork" style={{ height: '100vh' }} />
        </>
    )
};

export default ProcessTree;