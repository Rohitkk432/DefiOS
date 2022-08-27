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
                label: 'Issues Created',
                data: [10,25,12,31,45,20,30],
                borderColor: '#fb9230',
                backgroundColor: '#fb9230',
                yAxisID: 'y',
                tension: 0.3,
            },
            {
                label: 'APE Staked',
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
            <div className='w-[30%] h-full rounded-md bg-[#191C21] flex flex-col justify-center items-start px-[2%]'>
                <div className='text-[3vh] font-semibold mb-[10%] flex flex-col items-center w-full' >
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/ape.svg" alt="" className='w-[10vh] h-[10vh] mb-[1%]' />
                    <div>Ape Hackers Pro X</div>
                </div>
                <div className='w-full flex flex-col justify-between items-start text-[2vh]' >
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Token : </div>
                        <div className='text-gray-400'>Apes (APE)</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Contract :</div>
                        <div className='text-gray-400'>0x0091...e3f3</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div >Repository : </div>
                        <div className='text-gray-400 flex flex-row justify-end w-[70%]'>
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                            <div>/ape-hackers</div>
                        </div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Created by :</div>
                        <div className='text-gray-400'>0x1482...50d8</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Created at :</div>
                        <div className='text-gray-400'>1 month ago</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Chain :</div>
                        <div className='text-gray-400'>Neon Testnet</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Top Holder :</div>
                        <div className='text-gray-400'>0x1482...50d8</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Top Staker :</div>
                        <div className='text-gray-400'>0x1482...50d8</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Top Solver :</div>
                        <div className='text-gray-400 flex flex-row justify-end w-[70%]'>
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                            <div>/never2average</div>
                        </div>
                    </div>
                </div>
                <div className='font-bold text-center
                border border-white text-[2.5vh]
                rounded-md py-[2.5%] my-[3%] w-full' >
                    <span>1 APE = $0.5</span>
                    <span className='text-green-500'> (+0.5%)</span>
                </div>
            </div>
            <div className='w-[69%] text-center h-full rounded-md  p-[1.5%] bg-[#191C21]'>
                <div className='text-[#91A8ED] text-[4vh]'>Community Health</div>
                <MultiAxisLineChart/>
            </div>
        </div>
    );
}

export default DaoDetailsTop;