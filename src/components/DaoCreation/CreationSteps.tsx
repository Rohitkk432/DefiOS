import React from 'react'

interface CreationStepsProps {
    step: number;
}

const CreationSteps: React.FC<CreationStepsProps> = ({step}) => {

    return (
        <div 
        className='w-1/6 h-1/3 bg-[#121418] rounded-xl text-[#F8ECDE] customGradient'
        >
            <div className={`w-full  text-center text-[1.81vh] border-b border-[#9D9D9D] py-[5%] mb-[8%] font-semibold`} >DAO Creation Steps</div>
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(98vh/24)] h-[calc(98vh/24)] mx-[8%] text-[1.63vh] border rounded-full flex items-center justify-center ${(step>=1)?'bg-[#A7B9FC] border-[#A7B9FC]':null}`}>1</div>
                <div className={`text-[1.63vh] font-semibold ${(step>=1)?'text-[#A7B9FC]':null}`}>
                    Choose your repository 
                </div>
            </div>
            <div className={`w-[calc(98vh/48)] h-[calc(98vh/54)] mx-[8%] border-r ${(step>=1)?'border-solid border-[#A7B9FC]':'border-dashed'}`}></div>
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(98vh/24)] h-[calc(98vh/24)] mx-[8%] text-[1.63vh] border rounded-full flex items-center justify-center ${(step>=2)?'bg-[#A7B9FC] border-[#A7B9FC]':null}`}>2</div>
                <div className={`text-[1.63vh] font-semibold ${(step>=2)?'text-[#A7B9FC]':null}`}>
                    Customize your token
                </div>
            </div>
            <div className={`w-[calc(98vh/48)] h-[calc(98vh/54)] mx-[8%] border-r ${(step>=1)?'border-solid border-[#A7B9FC]':'border-dashed'}`}></div>
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(98vh/24)] h-[calc(98vh/24)] mx-[8%] text-[1.63vh] border rounded-full flex items-center justify-center ${(step>=3)?'bg-[#A7B9FC] border-[#A7B9FC]':null}`}>3</div>
                <div className={`text-[1.63vh] font-semibold ${(step>=3)?'text-[#A7B9FC]':null}`}>
                    Set initial distribution
                </div>
            </div>
            <div className={`w-[calc(98vh/48)] h-[calc(98vh/54)] mx-[8%] border-r ${(step>=1)?'border-solid border-[#A7B9FC]':'border-dashed'}`}></div>
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(98vh/24)] h-[calc(98vh/24)] mx-[8%] text-[1.63vh] border rounded-full flex items-center justify-center ${(step>=4)?'bg-[#A7B9FC] border-[#A7B9FC]':null}`}>4</div>
                <div className={`text-[1.63vh] font-semibold ${(step>=4)?'text-[#A7B9FC]':null}`}>
                    Confirm DAO Creation 
                </div>
            </div>
        </div>
    );
}

export default CreationSteps;