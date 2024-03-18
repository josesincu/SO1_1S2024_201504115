import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function CpuChartLine() {

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                ticks: {
                    display: false
                },
                grid: {
                    drawBorder: false,
                    display: false
                },
            },
        },
    };

    const [chartData, setChartData] = useState({
        labels: ['In'],
        datasets: [
            {
                label: 'USO',
                data: [0],
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132)',
                pointRadius: 0
            },
            {
                label: 'LIBRE',
                data: [0],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192)',
                pointRadius: 0
            },
        ],
    });

    useEffect(() => {
        const interval = setInterval(() => {
            // fetch("http://localhost:2024/api/cpu")
            fetch("/api/cpu")
                .then(response => response.json())
                .then(() => {
                })
                .catch(err => { console.log(err) })

            // fetch("http://localhost:2024/api/cpu-records")
            fetch("/api/cpu-records")
                .then(response => response.json())
                .then(data => {
                    let labels = [];
                    let dataFree = [];
                    let dataBusy = [];
                    data.forEach(element => {
                        labels.push(element.id.toString());
                        dataFree.push(element.free.toString());
                        dataBusy.push(element.busy.toString());
                    });
                    setChartData(prevChartData => ({
                        ...prevChartData,
                        labels,
                        datasets: [
                            {
                                ...prevChartData.datasets[0],
                                data: dataBusy,
                            },
                            {
                                ...prevChartData.datasets[1],
                                data: dataFree,
                            }
                        ]
                    }));
                })
                .catch(err => { console.log(err) })

        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <h2 style={{ margin: 0, textAlign: 'center' }}> CPU </h2>
            <Line data={chartData} options={options} />
        </>
    )
};

export default CpuChartLine;