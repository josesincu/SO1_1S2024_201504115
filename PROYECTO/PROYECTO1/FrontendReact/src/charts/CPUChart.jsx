import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';


function CPUChart() {
    const [chartData, setChartData] = useState({
        labels: ['USO', 'LIBRE'],
        datasets: [{
            label: 'label - memory ram',
            data: [50, 50],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    });

    const [numCPU, setNumCPU] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // fetch("http://localhost:2024/api/cpu")
            fetch("/api/cpu")
                .then(response => response.json())
                .then(data => {
                    const used = data.used;
                    const notused = data.notused;
                    setNumCPU(data.num_cpu)
                    setChartData(prevChartData => ({
                        ...prevChartData,
                        labels: [`USO ${used.toFixed(2)}%`, `LIBRE ${notused.toFixed(2)}%`],
                        datasets: [{
                            ...prevChartData.datasets[0],
                            data: [used, notused],
                        }]
                    }));
                })
                .catch(err => { console.log(err) })

        }, 500);
        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <div>
                <h2 style={{ margin: 0, textAlign: 'center' }}>CPU </h2>
                <h2 style={{ margin: 0, textAlign: 'center' }}> {numCPU} CPUs disponibles </h2>
                <div id='divChart' style={{ maxHeight: '700px', display: 'flex', justifyContent: 'center' }}>
                    <Pie data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
            </div>
        </>
    )
};

export default CPUChart;