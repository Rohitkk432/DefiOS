import React from 'react'
import {useState,useEffect} from 'react'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

interface CreationConfirmRepoProps {

}

interface PieChartProps{
    dataPie: any;
    optionsPie: any;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChartProps> = ({dataPie,optionsPie}) => {
    return (
        <div className='w-[30%] mb-[2%]'>
            <Doughnut data={dataPie} options={optionsPie} />
        </div>
    )
}

const CreationConfirmRepo: React.FC<CreationConfirmRepoProps> = ({}) => {

    const pieColors = ['#7B7C7D','#6495ED','#0047AB','#00008B','#3F00FF','#5D3FD3','#4169E1'];

    const [dataPie,setDataPie] = useState([100])
    const [fullData,setFullData] = useState<any>({})
    const [contriKeys,setContriKeys] = useState<any>([])

    useEffect(()=>{
        const pieData=[100]
        const storageData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')

        if(storageData===[] || storageData==={} || storageData==='') return

        const DistributionData = storageData.distribution
        const data = Object.values(DistributionData).map((value:any)=>parseInt(value.replace('%','')))
        const dataContributors = Object.keys(DistributionData);

        let totalValue=0
        if(storageData.distributionPercentage!==undefined){
            pieData[0] = 100 - storageData.distributionPercentage
            data.map((value:any)=>{
                totalValue+=value
                const relativeVal = (value/100)*storageData.distributionPercentage
                pieData.push(relativeVal)
            })
            if(totalValue===100){
                pieData[0] += 0
            }else if(totalValue<100){
                pieData[0] += ((100-totalValue)/100)*storageData.distributionPercentage
            }else if(totalValue>100){
                pieData[0] -= ((totalValue-100)/100)*storageData.distributionPercentage
            }
        }else{
            pieData[0] = 100
            data.map((value:any)=>{
                totalValue+=value
                pieData.push(value)
            })
        }
        
        setDataPie(pieData)
        setFullData(storageData)
        setContriKeys(dataContributors)
    },[])

    const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';

    const options = {
        plugins: {
            tooltip: {
                enabled: false,
            }
        }
    }

    const data = {
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
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between items-center'
        >
            <div className='flex flex-col justify-start items-start h-[90%] w-full' >
                {/* token details */}
                <div className='flex flex-row justify-start items-center w-full'>
                    <img src={fullData.tokenImgPreview} alt="token" className='w-[10vh] h-[10vh] mr-[4%] bg-white rounded-full' />
                    <div>
                        <div className={`${fontsizer} font-semibold`}>{fullData.tokenName} token</div>
                        <div className={`${fontsizer}`}>{fullData.tokenSymbol}</div>
                    </div>
                </div>

                {/* config details */}
                <div className={`flex flex-col justify-start items-center w-full mt-[10%] mb-[8%] ${fontsizer2}`}>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>DAO Name</div>
                        <div className='w-[60%]'>{fullData.daoName}</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>Repository Name</div>
                        <div className='w-[60%]'>{fullData.repoFullName}</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>DAO Fees</div>
                        <div className='w-[60%]'>{fullData.DaoFees}</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>Deployment Network</div>
                        <div className='w-[60%]'>{fullData.network}</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>Distribution Algorithm</div>
                        <div className='w-[60%]'>{fullData.algorithm}</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>Total Token Supply</div>
                        <div className='w-[60%]'>10,000,000 Tokens</div>
                    </div>
                </div>

                {/* distribution details */}
                <div className={`${fontsizer} font-semibold mb-[2%]`} >Token Distribution</div>
                <div className='flex flex-row justify-center items-center w-full'>
                    <PieChart optionsPie={options} dataPie={data} />
                    <div className='flex flex-col items-center justify-between w-[70%]'>
                        {
                            contriKeys.map((contriKey:any,index:number)=>{
                                return (
                                    <div className={`w-[90%] mt-[2%] ${fontsizer2} flex flex-row items-center justify-between`} key={index} >
                                        <div className='font-semibold'>{contriKey}</div>
                                        <div className='font-semibold'>{fullData.distribution[`${contriKey}`]}</div>
                                    </div>
                                )})
                        }
                    </div>
                </div>
            </div>
            {/* Submit Btn */}
            <button className={`bg-[#91A8ED] w-full py-[2%] ${fontsizer2} font-semibold rounded-md`} >
                Confirm DAO Creation
            </button>
        </div>
    );
}

export default CreationConfirmRepo;