import React from 'react'

import { XIcon } from '@heroicons/react/outline';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import Tags from '../utils/Tags'
import IssueState from '../utils/IssueState'

interface IssueActionProps {
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
}

interface PieChartProps{
    dataPie: any;
    optionsPie: any;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChartProps> = ({dataPie,optionsPie}) => {
    return (
        <div className='w-[40%] mb-[2%]'>
            <Doughnut data={dataPie} options={optionsPie} />
        </div>
    )
}

const IssueAction: React.FC<IssueActionProps> = ({setPopupState}) => {

    const pieColors = ['#7B7C7D','#6495ED','#0047AB','#00008B','#3F00FF','#5D3FD3','#4169E1'];

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
                // data: dataPie,
                data: [50,20,10,10,8,2],
                backgroundColor: pieColors,
                borderWidth: 0,
                rotation:-10,
            },
        ],
    };

    return (
        <div className='w-full h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-20 
        flex items-center justify-center text-white' >
            <div className='w-[70vw] h-[75vh] bg-[#262B36] rounded-md 
            shadow-[0_4vh_4vh_5vh_rgba(0,0,0,0.3)] 
            flex flex-row items-center justify-between py-[1%] px-[1.5%]' >

                <div className='w-[66%] h-full flex flex-col justify-start items-start'>
                    <div className='flex flex-row items-center w-full flex-wrap text-[3.5vh] font-semibold' >
                        CLI flask run describes that uses --debug to enable debugger and reloader, but flask run does not have the -- debug option
                        <IssueState issueState='open' />
                    </div>
                    <div className='flex flex-row justify-between items-center w-full flex-wrap text-[2.5vh]' >
                        <div className='w-[45%] flex flex-row'>
                            <div className='' >Created by :</div> 
                            <div className=' ml-[2%] rounded-full text-gray-300 flex flex-row items-center' >
                                <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                                <div>/never2average</div>
                            </div>
                        </div>
                        <div className='w-[45%] flex flex-row'>
                            <div className=' ml-[2%]' >Created at :</div> 
                            <div className=' ml-[2%] rounded-full text-gray-300' >
                                5 days ago
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center w-full flex-wrap' >
                        <div className='text-[2.5vh]' >Tags :</div> 
                        <Tags tag='help wanted' />
                        <Tags tag='urgent' />
                    </div>
                    <div className='flex flex-row items-center w-full flex-wrap text-[2.5vh]' >
                        <div>Issue Url :</div> 
                        <a href="https://github.com/pallets/flask/issues/4777" target="_blank" className=' ml-[2%] rounded-full text-gray-300 flex flex-row items-center' >
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                            <div>/pallets/flask/issues/4777</div>
                        </a>
                    </div>

                    <div className='w-full h-full overflow-y-scroll border border-white 
                    p-[2.2%] mt-[4%] rounded-[2vh] customScrollbar text-[2.3vh]'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum laborum provident enim debitis. Commodi qui consequatur facilis aliquid porro debitis sit. Vero consequatur dignissimos harum nostrum alias quaerat aperiam commodi perferendis molestiae saepe eaque corrupti ipsa veniam officiis deserunt, debitis non nihil facilis sit dolore fugiat voluptatem vel natus maiores? Distinctio rerum, aperiam sint similique eos corporis nisi nam numquam sed voluptates tempore illo cumque, rem laboriosam odio facilis sequi alias itaque enim nobis blanditiis impedit. Eveniet architecto, dicta mollitia consectetur numquam culpa aliquam quas quasi, illo quae totam aperiam perspiciatis eius cum corrupti sequi consequatur sed repellat minima? Facilis?</div>

                </div>
                <div className='w-[32%] h-full flex flex-col justify-start items-end'>
                    <XIcon className='h-[4vh] mb-[4%]' 
                    onClick={()=>{
                        setPopupState('none')
                        localStorage.removeItem('popupState')
                    }}/>
                    <div className='w-full h-[91%] bg-gray-600 flex flex-col items-start justify-end 
                    py-[4%] px-[3%] rounded-[1vh] text-[2.5vh]' >
                        <div className='text-[3vh] mb-[2%]'>Top APE Stakers</div>

                        <div className='w-full h-[40%] flex flex-row justify-between items-center'>
                            <PieChart optionsPie={options} dataPie={data} />
                            <div className='flex flex-col items-center justify-center w-[60%] h-full customScrollbar overflow-y-scroll'>
                                <div className={`w-[90%] my-[2%] text-[1.9vh] flex flex-row items-center justify-between`}>
                                    <div className='font-semibold'>0x1465...1231</div>
                                    <div className='font-semibold'>20 APE</div>
                                </div>
                                <div className={`w-[90%] my-[2%] text-[1.9vh] flex flex-row items-center justify-between`}>
                                    <div className='font-semibold'>0x1465...1231</div>
                                    <div className='font-semibold'>10 APE</div>
                                </div>
                                <div className={`w-[90%] my-[2%] text-[1.9vh] flex flex-row items-center justify-between`}>
                                    <div className='font-semibold'>0x1465...1231</div>
                                    <div className='font-semibold'>10 APE</div>
                                </div>
                                <div className={`w-[90%] my-[2%] text-[1.9vh] flex flex-row items-center justify-between`}>
                                    <div className='font-semibold'>0x1465...1231</div>
                                    <div className='font-semibold'>8 APE</div>
                                </div>
                                <div className={`w-[90%] my-[2%] text-[1.9vh] flex flex-row items-center justify-between`}>
                                    <div className='font-semibold'>0x1465...1231</div>
                                    <div className='font-semibold'>2 APE</div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-row justify-center items-center border-2 border-[#91A8ED] w-full py-[2.5%] rounded-[1vh] mb-[8%] mt-[5%] text-[2.7vh]'>
                            <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/ape.svg" className='w-[4.5vh] h-[4.5vh] mr-[3%]' />
                            <div>50 APE ($25)</div>
                        </div>
                        <div className='flex flex-col w-full items-center mt-[2%] 
                        border border-b-0 rounded-t-[1vh] px-[3%] py-[1.5%]'>
                            <div className='w-full flex flex-row items-center justify-between mb-[2%]'>
                                <div className='text-[1.8vh]' >Balance:</div>
                                <div className='text-[2.3vh] font-semibold text-[#91A8ED]'>50% Max</div>
                            </div>
                            <div className='w-full flex flex-row items-center justify-between mb-[2%]'>
                                <div className='text-[2vh] px-[7%] py-[1%] bg-[#272A36] rounded-[1.5vh]'>APE</div>
                                <div className='text-[2.7vh]'>0.0</div>
                            </div>
                        </div>
                        <button className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-full py-[2.5%] rounded-b-[1vh] text-[2.7vh]'>Stake</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default IssueAction;