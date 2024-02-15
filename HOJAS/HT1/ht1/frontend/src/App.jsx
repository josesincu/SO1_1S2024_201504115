import {useState,useEffect} from 'react';
import './App.css';
import {GreetMemoriaUsada} from "../wailsjs/go/main/App";
import {GreetMemoriaLibre} from "../wailsjs/go/main/App";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';




function App() {
    const [memoriaLibre, setMemoriaLibre] = useState(0);
    const [memoriaUsada, setMemoriaUsada] = useState(0);
    const updateMemoriaUsada = (usada) => setMemoriaUsada(usada);
    const updateMemoriaLibre = (libre) => setMemoriaLibre(libre);
    
    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
        labels: ['Usado', 'Libre'],
        datasets: [
        {
            label: '# of Votes',
            data: [memoriaUsada ,memoriaLibre],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 2.5,
        },
  ],
};

useEffect(() => {
    setTimeout(() => {
        GreetMemoriaUsada().then(updateMemoriaUsada);
        GreetMemoriaLibre().then(updateMemoriaLibre);
    }, 500);
  });

    return (
        <div id="App">
            <div id="container">
                <h1>Memoria Libre</h1>
                <h2>{memoriaLibre}</h2>
                <h1>Memoria Usada</h1>
                <h2>{memoriaUsada}</h2>  
            </div>
            <div id="wiget">
                <   Doughnut data={data} width={"100%"} height={"400%"} options={{ maintainAspectRatio: false }} />
            </div>     
        </div>     
    )
}

export default App
