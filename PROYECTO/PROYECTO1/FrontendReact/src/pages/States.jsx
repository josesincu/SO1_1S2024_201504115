import React, { useEffect, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

function States() {
    const [pid, setPid] = useState(0);
    const [state, setState] = useState("");
    const [dataChart, setDataChart] = useState({
        nodes: new DataSet([]),
        edges: new DataSet([]),
    });
    const [nodesChart, setNodesChart] = useState([]);
    const [edgesChart, setEdgesChart] = useState([]);
    const [usageChange, setUsageChange] = useState(false);

    const options = {
        layout: {
            hierarchical: {
                direction: 'LR', // Dirección: Arriba-Abajo. Usa LR para Izquierda-Derecha
                // sortMethod: 'directed'
            },
        }
    };

    const buildNodes = (elements) => {

        let exists = true;
        let ant_id = "";
        let nodes = [];
        let edges = [];

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            let isLast = i == elements.length - 1;
            if (element.state_process == 1) { // ________________ NEW 
                exists = nodes.find(node => node.id === "new");
                if (!exists) nodes.push({ id: "new", label: `NEW`, shape: "circle" })
                ant_id = "new";
            } else if (element.state_process == 2) { // __________________  RUNNING
                exists = nodes.find(node => node.id === "running");
                if (isLast) {
                    if (exists) {
                        nodes = nodes.map((el) => {
                            if (el.id == "running") {
                                return { id: "running", label: `RUNNING`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 }
                            } else {
                                return el
                            }
                        })
                    } else {
                        nodes.push({ id: "running", label: `RUNNING`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 })
                    }
                } else {
                    if (!exists) {
                        nodes.push({ id: "running", label: `RUNNING`, shape: "circle" })
                    }
                }
                if (ant_id) {
                    exists = edges.find(node => node.from === ant_id);
                    edges.push({ from: ant_id, to: "running", arrows: "to" })
                }
                ant_id = "running"
            } else if (element.state_process == 3) { // __________________  WAITING
                exists = nodes.find(node => node.id === "waiting");
                if (isLast) {
                    if (exists) {
                        nodes = nodes.map((el) => {
                            if (el.id == "waiting") {
                                return { id: "waiting", label: `WAITING`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 }
                            } else {
                                return el
                            }
                        })
                    } else {
                        nodes.push({ id: "waiting", label: `WAITING`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 })
                    }
                } else {
                    if (!exists) {
                        nodes.push({ id: "waiting", label: `WAITING`, shape: "circle" })
                    }
                }
                if (ant_id) {
                    exists = edges.find(node => node.from === ant_id);
                    edges.push({ from: ant_id, to: "waiting", arrows: "to" })
                }
                ant_id = "waiting"
            } else if (element.state_process == 4) { // __________________  READY
                exists = nodes.find(node => node.id === "ready");
                if (isLast) {
                    if (exists) {
                        nodes = nodes.map((el) => {
                            if (el.id == "ready") {
                                return { id: "ready", label: `READY`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 }
                            } else {
                                return el
                            }
                        })
                    } else {
                        nodes.push({ id: "ready", label: `READY`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 })
                    }
                } else {
                    if (!exists) {
                        nodes.push({ id: "ready", label: `READY`, shape: "circle" })
                    }
                }
                if (ant_id) {
                    exists = edges.find(node => node.from === ant_id);
                    edges.push({ from: ant_id, to: "ready", arrows: "to" })
                }
                ant_id = "ready"
            } else if (element.state_process == 5) { // __________________  TERMINATED
                exists = nodes.find(node => node.id === "terminated");
                if (isLast) {
                    if (exists) {
                        nodes = nodes.map((el) => {
                            if (el.id == "terminated") {
                                return { id: "terminated", label: `TERMINATED`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 }
                            } else {
                                return el
                            }
                        })
                    } else {
                        nodes.push({ id: "terminated", label: `TERMINATED`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 })
                    }
                } else {
                    if (!exists) {
                        nodes.push({ id: "terminated", label: `TERMINATED`, shape: "circle" })
                    }
                }
                if (ant_id) {
                    exists = edges.find(node => node.from === ant_id);
                    edges.push({ from: ant_id, to: "terminated", arrows: "to" })
                }
                ant_id = "terminated"
            }
        }

        return { "nodes": nodes, "edges": edges }
    }

    useEffect(() => {
        const network = new Network(document.getElementById('networkStates'), dataChart, options);
    }, [dataChart])

    useEffect(() => {
        // fetch("http://localhost:2024/api/process-current")
        fetch("/api/process-current")
            .then(response => response.json())
            .then(data => {
                if (!data || !data.length) return;
                setUsageChange(true)
                console.log("mitadata", data);
                let last_node = data[data.length - 1];
                let pid = last_node["pid"];
                let state_process = last_node["state_process"];
                if (state_process == 1) {
                    setState("resume")
                } else if (state_process == 2) {
                    setState("resume")
                } else if (state_process == 3) {
                    setState("stop")
                } else if (state_process == 4) {
                    setState("stop")
                } else {
                    setState("kill")
                }

                let elements = data;
                setPid(pid)

                let nodes = [];
                let edges = [];
                let res = buildNodes(elements)
                console.log("build", res)
                nodes = res.nodes;
                edges = res.edges;

                let losDatos = {
                    nodes: new DataSet(nodes),
                    edges: new DataSet(edges),
                }
                setNodesChart(nodes)
                setEdgesChart(edges)
                setDataChart(losDatos)
            }).catch(err => { console.log(err) })
    }, [])

    useEffect(() => {
        console.log(state, usageChange, "miestado")
        if (!usageChange) {
            if (state == "new") {
                createNewProcess();
            } else if (state == "stop") {
                stopTheProcess();
            } else if (state == "resume") {
                resumeTheProcess();
            } else if (state == "kill") {
                killTheProcess();
            }
        }
    }, [state])

    const createNewProcess = () => {
        // fetch("http://localhost:2024/api/process-start")
        fetch("/api/process-start")
            .then(response => response.json())
            .then(data => {
                setPid(data.pid);

                let nodes = [];
                let edges = [];
                nodes.push({ id: "new", label: `NEW`, shape: "circle" })
                nodes.push({ id: "ready", label: `READY`, shape: "circle" })
                nodes.push({ id: "running", label: `RUNNING`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 })
                edges.push({ from: "new", to: "ready", arrows: "to" })
                edges.push({ from: "ready", to: "running", arrows: "to" })
                let losDatos = {
                    nodes: new DataSet(nodes),
                    edges: new DataSet(edges),
                }
                setNodesChart(nodes)
                setEdgesChart(edges)
                setDataChart(losDatos)
            }).catch(err => { console.log(err) })
    }

    const stopTheProcess = () => {
        // fetch(`http://localhost:2024/api/process-stop?pid=${pid}`)
        fetch(`/api/process-stop?pid=${pid}`)
            .then(response => response.json())
            .then(data => {
                let nodes = nodesChart;
                let edges = edgesChart;

                let exists = nodes.find(node => node.id === "waiting");
                if (!exists) nodes.push({ id: "waiting", label: `WAITING`, shape: "circle" });

                nodes = nodes.map((el) => {
                    if (el.id == "ready") {
                        return { id: "ready", label: `READY`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 };
                    }
                    if (el.id == "running") {
                        return { id: "running", label: `RUNNING`, shape: "circle" };
                    } else {
                        return el
                    }
                });

                exists = edges.find(node => node.from === "waiting");
                if (!exists) edges.push({ from: "waiting", to: "ready", arrows: "to" });

                exists = edges.find(node => node.from === "running");
                if (!exists) edges.push({ from: "running", to: "waiting", arrows: "to" });

                edges = edges.map((el) => {
                    if (el.from == "running") {
                        return { from: "running", to: "waiting", arrows: "to" };
                    } else {
                        return el
                    }
                });

                let losDatos = {
                    nodes: new DataSet(nodes),
                    edges: new DataSet(edges),
                }

                console.log(nodes, edges)

                setNodesChart(nodes)
                setEdgesChart(edges)
                setDataChart(losDatos)
            }).catch(err => { console.log(err) })
    }

    const resumeTheProcess = () => {
        // fetch(`http://localhost:2024/api/process-resume?pid=${pid}`)
        fetch(`/api/process-resume?pid=${pid}`)
            .then(response => response.json())
            .then(data => {
                let nodes = nodesChart;
                let edges = edgesChart;
                console.log(JSON.stringify(nodesChart), JSON.stringify(edgesChart));

                let exists = nodes.find(node => node.id === "running");
                if (!exists) nodes.push({ id: "running", label: `RUNNING`, shape: "circle" });

                nodes = nodes.map((el) => {
                    if (el.id == "ready") {
                        return { id: "ready", label: `READY`, shape: "circle" };
                    }
                    if (el.id == "waiting") {
                        return { id: "waiting", label: `WAITING`, shape: "circle" };
                    }
                    if (el.id == "running") {
                        return { id: "running", label: `RUNNING`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 };
                    } else {
                        return el
                    }
                });

                let losDatos = {
                    nodes: new DataSet(nodes),
                    edges: new DataSet(edges),
                }

                console.log(nodes, edges)

                setNodesChart(nodes)
                setEdgesChart(edges)
                setDataChart(losDatos)
            }).catch(err => { console.log(err) })
    }

    const killTheProcess = () => {
        // fetch(`http://localhost:2024/api/process-kill?pid=${pid}`)
        fetch(`/api/process-kill?pid=${pid}`)
            .then(response => response.json())
            .then(data => {
                let nodes = nodesChart;
                let edges = edgesChart;
                console.log(JSON.stringify(nodesChart), JSON.stringify(edgesChart));

                let id = "";
                for (let el of nodes) {
                    if (el.color) {
                        id = el.id;
                        break;
                    }
                }

                nodes = nodes.map((el) => {
                    return { id: el.id, label: el.label, shape: "circle" }
                });
                nodes.push({ id: "terminated", label: `TERMINATED`, shape: "circle", color: "rgb(75, 192, 192)", borderColor: "rgba(75, 192, 192, 0.2)", borderWidth: 3 });
                edges.push({ from: id, to: "terminated", arrows: "to" })


                let losDatos = {
                    nodes: new DataSet(nodes),
                    edges: new DataSet(edges),
                }

                console.log(nodes, edges)

                setNodesChart(nodes)
                setEdgesChart(edges)
                setDataChart(losDatos)
            }).catch(err => { console.log(err) })
    }

    const newProcess = () => { if (state != "new") { setUsageChange(false); setState("new"); } }
    const stopProcess = () => { if (state != "stop") { setUsageChange(false); setState("stop");} }
    const resumeProcess = () => { if (state != "resume" && state != "new") { setUsageChange(false); setState("resume");} }
    const killProcess = () => { if (state != "kill") { setUsageChange(false); setState("kill");} }

    return (
        <>
            <div className='container mt-5'>
                <label className='w-100 text-center mb-4 text-info'>PID: {pid ? pid : '_ _ _ _ _'}; Estado: {state == "new" || state == "resume" ? "running" : state}</label>
                <div className='row'>
                    <button disabled={pid && state != "kill"} type="button" className="btn btn-success col me-3" onClick={newProcess}>New</button>
                    <button disabled={state == "kill" || !pid} type="button" className="btn btn-warning col me-3" onClick={stopProcess}>Stop</button>
                    <button disabled={state == "kill" || !pid} type="button" className="btn btn-secondary col me-3" onClick={resumeProcess}>Resume</button>
                    <button disabled={state == "kill" || !pid} type="button" className="btn btn-danger col me-3" onClick={killProcess}>Kill</button>
                </div>
                <hr />
                <div id="networkStates" style={{ width: '100vh', height: '70vh' }} />
            </div>
        </>
    )
}

export default States