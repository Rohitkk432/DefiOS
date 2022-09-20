import React from 'react'

import {timeAgo} from '../utils/timeUtils'

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
    Token : string,
}

const MultiAxisLineChart: React.FC<MultiAxisLineChartProps> = ({Token}) => {
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
                label: `${Token} Staked`,
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
    DaoInfo: any;
}

const DaoDetailsTop: React.FC<DaoDetailsTopProps> = ({DaoInfo}) => {

    return (
        <div className='w-full h-[48%] flex flex-row justify-between items-center'>
            <div className='w-[30%] h-full rounded-md bg-[#191C21] flex flex-col justify-center items-start px-[2%]'>
                {DaoInfo===undefined &&
                    <div className='w-full h-full flex flex-col justify-center items-center'>
                        <svg aria-hidden="true" className="w-[5vh] h-[5vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <div className='text-[2.5vh] mt-[1vh]' >Loading</div>
                    </div>
                }
                {DaoInfo && 
                <>
                <div className='text-[3vh] font-semibold mb-[10%] flex flex-col items-center w-full' >
                    <img src={DaoInfo.metadata.tokenImg} alt="" className='rounded-full w-[10vh] h-[10vh] mb-[1%]' />
                    <div>{DaoInfo.metadata.daoName}</div>
                </div>
                <div className='w-full flex flex-col justify-between items-start text-[2vh]' >
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Token : </div>
                        <div className='text-gray-400'>{`${DaoInfo.metadata.tokenName} (${DaoInfo.metadata.tokenSymbol})`}</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Contract :</div>
                        <div className='text-gray-400'>
                            {(DaoInfo.DAO.slice(0,5)+"..."+DaoInfo.DAO.slice(37,42))}
                        </div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div >Repository : </div>
                        <a href={DaoInfo.metadata.repoUrl} target="_blank" className='text-gray-400 flex flex-row justify-end w-[70%]'>
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                            <div>/{DaoInfo.metadata.repoName}</div>
                        </a>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Created by :</div>
                        <div className='text-gray-400'>{(DaoInfo.owner.slice(0,5)+"..."+DaoInfo.owner.slice(37,42))}</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Created at :</div>
                        <div className='text-gray-400'>{timeAgo(DaoInfo.metadata.createdAt)} ago</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Chain :</div>
                        <div className='text-gray-400'>
                            {DaoInfo.metadata.chain}</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Top Holder :</div>
                        <div className='text-gray-400'>{(DaoInfo.owner.slice(0,5)+"..."+DaoInfo.owner.slice(37,42))}</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Top Staker :</div>
                        <div className='text-gray-400'>{(DaoInfo.owner.slice(0,5)+"..."+DaoInfo.owner.slice(37,42))}</div>
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
                    {/* <span>1 APE = $0.5</span>
                    <span className='text-green-500'> (+0.5%)</span> */}
                    <div>{DaoInfo.metadata.tokenSymbol} = ??</div>
                </div>
                </>
                }
            </div>

            <div className='w-[69%] text-center h-full rounded-md  p-[1.5%] bg-[#191C21]'>
                {DaoInfo===undefined &&
                    <div className='w-full h-full flex flex-col justify-center items-center'>
                        <svg aria-hidden="true" className="w-[5vh] h-[5vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <div className='text-[2.5vh] mt-[1vh]' >Loading</div>
                    </div>
                }
                {DaoInfo &&
                <>
                <div className='text-[#91A8ED] text-[4vh]'>Community Health</div>
                <MultiAxisLineChart Token={DaoInfo.metadata.tokenSymbol} />
                </>
                }
            </div>
        </div>
    );
}

export default DaoDetailsTop;