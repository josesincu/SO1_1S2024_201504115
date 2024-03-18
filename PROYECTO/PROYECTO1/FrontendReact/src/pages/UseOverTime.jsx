import React from 'react';
import RamChartLine from '../charts/RamCharLine';
import CpuChartLine from '../charts/CPUChartLine';

function UseOverTime() {
    return (
        <>
            <div className='row'>
                <div className='col m-5'>
                    <RamChartLine />
                </div>
                <div className='col m-5'>
                    <CpuChartLine />
                </div>
            </div>
        </>
    )
}

export default UseOverTime