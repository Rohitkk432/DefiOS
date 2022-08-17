import React from 'react'

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
                data: [25,25,25,25],
                backgroundColor: [
                    '#7B7C7D',
                    '#283F94',
                    '#7082C3',
                    '#A7B9FC',
                ],
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
                    <img src="https://res.cloudinary.com/rohitkk432/image/upload/v1660741087/Ellipse_4_xox67k.png" alt="token" className='w-[10vh] h-[10vh] mr-[4%] bg-white rounded-full' />
                    <div>
                        <div className={`${fontsizer} font-semibold`}>defiOS token</div>
                        <div className={`${fontsizer}`}>DOS</div>
                    </div>
                </div>

                {/* config details */}
                <div className={`flex flex-col justify-start items-center w-full mt-[10%] mb-[8%] ${fontsizer2}`}>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>DAO Name</div>
                        <div className='w-[60%]'>defiOSOfficial</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>Repository Name</div>
                        <div className='w-[60%]'>never2average/defios-contracts</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>DAO Fees</div>
                        <div className='w-[60%]'>0.05%</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>Deployment Network</div>
                        <div className='w-[60%]'>Neon Testnet</div>
                    </div>
                    <div className='flex flex-row justify-center items-start w-full mb-[2%]' >
                        <div className='mr-[5%] w-[35%] text-right'>Distribution Algorithm</div>
                        <div className='w-[60%]'>By amount of code contributed ( minified )</div>
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