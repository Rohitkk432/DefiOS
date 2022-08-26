import React from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MultiAxisLineChartProps{
    
}

const MultiAxisLineChart: React.FC<MultiAxisLineChartProps> = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Line Chart - Multi Axis',
            },
            legend: {
                display: true,
                align:"start" as const,
                labels: {
                    usePointStyle: true,
                    pointStyle:'circle' as const,
                    padding: 30,
                    boxWidth: 5,
                    boxHeight: 5,
                    color: '#FFF' as const,
                },
            },
            tooltip: {
                enabled: true,
                usePointStyle: true,
                pointStyle:'circle' as const,
                borderWidth: 0,
                boxWidth:7,
                boxHeight:7,
                boxPadding:10,
                padding:15,
                backgroundColor:"rgba(78, 75, 116,0.8)",
                callbacks: {
                    // title: function (tooltipItem:any) {
                    //     return '';
                    // },
                    label: function (tooltipItem:any) {
                        var tooltipText = '';
                        if (tooltipItem.dataset.data[tooltipItem.dataIndex] != null)
                            tooltipText = tooltipItem.dataset.data[tooltipItem.dataIndex]!.toString();
                        return tooltipText;
                    }
                }
            }
        },
        scales: {
            x:{
                grid: {
                    display: false,
                },
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: {
                    display: false,
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    display: false,
                },
            },
        },
        elements: {
            point:{
                radius: 0
            },
        },
    };
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: [10,25,12,31,45,20,30],
                borderColor: 'rgb(232, 54, 232)',
                backgroundColor: 'rgb(232, 54, 232)',
                yAxisID: 'y',
                tension: 0.3,
            },
            {
                label: 'Dataset 2',
                data: [16,35,26,41,31,30,50],
                borderColor: 'rgb(68, 190, 215)',
                backgroundColor: 'rgb(68, 190, 215)',
                yAxisID: 'y1',
                tension: 0.3,
            },
        ],
    };
    return (
        <Line data={data} options={options} />
    );
}

interface DaoDetailsTopProps {

}

const DaoDetailsTop: React.FC<DaoDetailsTopProps> = ({}) => {
    return (
        <div className='w-full h-[48%] flex flex-row justify-between items-center'>
            <div className='w-[30%] h-full rounded-md bg-[#191C21] flex flex-col justify-start items-start p-[1.5%]'>
                <div className='text-[3vh] font-semibold mb-[2%]' >Ape Hackers Pro X</div>
                <div className='w-full flex flex-row justify-between items-center' >
                    <img src="https://res.cloudinary.com/rohitkk432/image/upload/v1660833498/defios_logo_gsg4eo.png" alt="" className='h-[13vh] w-[13vh] rounded-full' />
                    <div className='flex flex-col items-start justify-start w-[64%] text-[2.2vh]' >
                        <div className='mb-[2.5%] '>ape-hackers</div>
                        <div className='mb-[2.5%] '>never2average</div>
                        <div className='mb-[2.5%] '>Repository name</div>
                        <div className='mb-[2.5%] '>Repository name</div>
                    </div>
                </div>
                <div className='text-[2.5vh] my-[2%]' >Token Stats</div>
                <div className='text-[2.5vh] font-bold flex flex-row justify-start items-center w-full   shadow-[0_0.5vh_1vh_0.5vh_rgba(0,0,0,0.3)] rounded-md py-[2.5%] my-[1.5%]' >
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/ape.svg" alt="" className='w-[4.3vh] h-[4.3vh] mx-[10%]' />
                    <div className='w-[30%] ml-[10%]' >Apes</div>
                    <div className='w-[30%]'>APE</div>
                </div>
                <div className='text-[2.5vh] font-bold flex flex-row justify-evenly items-center w-full shadow-[0_0.5vh_1vh_0.5vh_rgba(0,0,0,0.3)] rounded-md py-[2%] my-[1.5%]' >
                    <div>1 APE</div>
                    <div>=</div>
                    <div>0.005 USDC</div>
                </div>

                <div className='text-[2.8vh] mt-[3%] mb-[2%] w-full text-center font-bold '>
                    Top 3 Holders
                </div>
                <div className='w-full flex flex-row justify-between items-center text-[2.2vh] mb-[2.5%]' >
                    <div>never2average</div>
                    <div>270 APE</div>
                </div>
                <div className='w-full flex flex-row justify-between items-center text-[2.2vh] mb-[2.5%]' >
                    <div>rohitkk432</div>
                    <div>190 APE</div>
                </div>
                <div className='w-full flex flex-row justify-between items-center text-[2.2vh] mb-[2.5%]' >
                    <div>AbhisekBasu1</div>
                    <div>65 APE</div>
                </div>
            </div>
            <div className='w-[69%] h-full rounded-md  p-[1.5%] bg-[#191C21]'>
                <MultiAxisLineChart/>
            </div>
        </div>
    );
}

export default DaoDetailsTop;