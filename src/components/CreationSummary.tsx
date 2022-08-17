import React from 'react'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { InformationCircleIcon } from '@heroicons/react/outline';

interface CreationSummaryProps {
    step: number;
}

interface PieChartProps{
    dataPie: any;
    optionsPie: any;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChartProps> = ({dataPie,optionsPie}) => {
    return (
        <div className='w-[43%] mb-[2%]'>
            <Doughnut data={dataPie} options={optionsPie} />
        </div>
    )
}

const CreationSummary: React.FC<CreationSummaryProps> = ({step}) => {

    const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';

    const options = {
        plugins: {
            tooltip: {
                enabled: false,
            }
        }
    }

    const data1 = {
        datasets: [
            {
                data: [100],
                backgroundColor: [
                    '#7B7C7D',
                    '#283F94',
                    '#7082C3',
                    '#A7B9FC',
                ],
                borderWidth: 0,
            },
        ],
    };
    const data2 = {
        datasets: [
            {
                data: [25,25,25,25],
                backgroundColor: [
                    '#7B7C7D',
                    '#283F94',
                    '#7082C3',
                    '#A7B9FC',
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div 
        className='w-[19.5%] min-h-[42.2%] h-auto bg-[#121418] rounded-2xl text-white flex flex-col items-center justify-between'
        >   
            <div className={`w-[90%] ${fontsizer} border-b border-[#9D9D9D] pb-[4%] pl-[1%] pt-[6%] text-left mb-[2%]`} >Initial Token Distribution</div>
            {(step>1)?(
                <div className='w-full min-h-[calc(0.422*0.6*98vh)] mb-[4%] flex flex-col items-center justify-between' >
                    <PieChart optionsPie={options} dataPie={(step<3)?data1:data2} />
                    {(step<3)?(
                        <div className={`w-[90%] mt-[2%] mb-[10%] ${fontsizer2} flex flex-row items-center justify-between`} >
                            <div className='text-[#7B7C7D] font-semibold'>DAO Name</div>
                            <div className='font-semibold'>100%</div>
                        </div>
                    ):(
                        <>
                            <div className={`w-[90%] mt-[2%] ${fontsizer2} flex flex-row items-center justify-between`} >
                                <div className='text-[#283F94] font-semibold'>Never2average</div>
                                <div className='font-semibold'>DAO Name 100%</div>
                            </div>
                            <div className={`w-[90%] mt-[2%] ${fontsizer2} flex flex-row items-center justify-between`} >
                                <div className='text-[#7082C3] font-semibold'>Never2average</div>
                                <div className='font-semibold'>DAO Name 100%</div>
                            </div>
                            <div className={`w-[90%] mt-[2%] ${fontsizer2} flex flex-row items-center justify-between`} >
                                <div className='text-[#A7B9FC] font-semibold'>Never2average</div>
                                <div className='font-semibold'>DAO Name 100%</div>
                            </div>
                        </>
                    )}
                </div>
            ):null
            }
            <div className='pb-[6%] mt-[2%] text-center' >
                <div className={`${fontsizer2} font-bold`} >Total token supply <InformationCircleIcon className='w-[6%] h-[6%] inline'/></div>
                <div className={fontsizer} >100M Tokens</div>
            </div>
        </div>
    );
}

export default CreationSummary;