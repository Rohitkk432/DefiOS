import React from 'react'
import {useState,useEffect} from 'react'


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { InformationCircleIcon } from '@heroicons/react/outline';

interface CreationSummaryProps {
    step: number;
    triggerToSummary: number;
    setTriggerToSummary: React.Dispatch<React.SetStateAction<number>>;
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

const CreationSummary: React.FC<CreationSummaryProps> = ({step,triggerToSummary}) => {

    const [dataPie,setDataPie] = useState([100])
    const [fullData,setFullData] = useState<any>({})
    const [contriKeys,setContriKeys] = useState<any>([])

    const pieColors = ['#7B7C7D','#6495ED','#0047AB','#00008B','#3F00FF','#5D3FD3','#4169E1'];
    useEffect(()=>{
        const pieData=[100]
        const storageData = JSON.parse(localStorage.getItem('DaoCreationData')||'')
        const DistributionData = storageData.distribution
        const data = Object.values(DistributionData).map((value:any)=>parseInt(value.replace('%','')))
        const dataContributors = Object.keys(DistributionData);
        data.map((value:any)=>{
            pieData.push(value)
            pieData[0]-=value
        })
        setDataPie(pieData)
        setFullData(storageData)
        setContriKeys(dataContributors)
    },[triggerToSummary])

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
                ],
                borderWidth: 0,
                rotation:-10,
            },
        ],
    };
    const data2 = {
        datasets: [
            {
                data: dataPie,
                backgroundColor: pieColors,
                borderWidth: 0,
                rotation:-10,
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
                        contriKeys.map((contriKey:any,index:number)=>{
                            return (
                                <div className={`w-[90%] mt-[2%] ${fontsizer2} flex flex-row items-center justify-between`} key={index} >
                                    <div className='text-[#6495ED] font-semibold' >{contriKey}</div>
                                    <div className='font-semibold'>{fullData.distribution[`${contriKey}`]} </div>
                                </div>
                            )})
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