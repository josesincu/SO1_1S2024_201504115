import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';


function RamChart() {
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

    const [totalRam, setTotalRam] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // fetch("http://localhost:2024/api/ram")
                fetch("/api/ram")
                .then(response => response.json())
                .then(data => {
                    const total = data.total;
                    const used = data.used;
                    const notused = data.notused;

                    setTotalRam(total);
                    setChartData(prevChartData => ({
                        ...prevChartData,
                        labels: [`USO ${used.toFixed(2)}% (${(total * used / 100000).toFixed(2)}GB)`, `LIBRE ${notused.toFixed(2)}% (${(notused * total / 100000).toFixed(2)}GB)`],
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
                <h2 style={{ margin: 0, textAlign: 'center' }}>Memoria RAM</h2>
                <h2 style={{ margin: 0, textAlign: 'center' }}> Total {(totalRam / 1000).toFixed(2)} GB</h2>
                <div id='divChart' style={{ maxHeight: '700px', display: 'flex', justifyContent: 'center' }}>
                    <Pie data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
            </div>
        </>
    )
};

export default RamChart;