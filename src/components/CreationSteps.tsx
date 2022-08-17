import React from 'react'

interface CreationStepsProps {

}

const CreationSteps: React.FC<CreationStepsProps> = ({}) => {

    const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';
    return (
        <div 
        className='w-1/6 h-1/3 bg-[#121418] rounded-xl text-[#F8ECDE]'
        >
            <div className={`w-full  text-center ${fontsizer} border-b border-[#9D9D9D] py-[5%] mb-[8%] font-semibold`} >DAO Creation Steps</div>
            {/* completed */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(98vh/24)] h-[calc(98vh/24)] mx-[8%] ${fontsizer2} border rounded-full flex items-center justify-center bg-[#A7B9FC] border-[#A7B9FC]`}>1</div>
                <div className={`${fontsizer2} font-semibold text-[#A7B9FC]`}>
                    Choose your repository 
                </div>
            </div>
            <div className='w-[calc(98vh/48)] h-[calc(98vh/54)] mx-[8%] border-r border-solid border-[#A7B9FC]'></div>
            {/* incomplete */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(98vh/24)] h-[calc(98vh/24)] mx-[8%] ${fontsizer2} border rounded-full flex items-center justify-center`}>2</div>
                <div className={`${fontsizer2} font-semibold`}>
                    Customize your token
                </div>
            </div>
            <div className='w-[calc(98vh/48)] h-[calc(98vh/54)] mx-[8%] border-r border-dashed'></div>
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(98vh/24)] h-[calc(98vh/24)] mx-[8%] ${fontsizer2} border rounded-full flex items-center justify-center`}>3</div>
                <div className={`${fontsizer2} font-semibold`}>
                    Set initial distribution
                </div>
            </div>
            <div className='w-[calc(98vh/48)] h-[calc(98vh/54)] mx-[8%] border-r border-dashed'></div>
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(98vh/24)] h-[calc(98vh/24)] mx-[8%] ${fontsizer2} border rounded-full flex items-center justify-center`}>4</div>
                <div className={`${fontsizer2} font-semibold`}>
                    Confirm DAO Creation 
                </div>
            </div>
        </div>
    );
}

export default CreationSteps;