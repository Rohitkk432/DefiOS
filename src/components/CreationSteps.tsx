import React from 'react'

interface CreationStepsProps {

}

const CreationSteps: React.FC<CreationStepsProps> = ({}) => {
        return (
            <div className='w-[13rem] h-[15rem] bg-[#121418] rounded-2xl text-[#F8ECDE]'>
                <div className='w-full text-sm text-center border-b border-[#9D9D9D] py-2.5 mb-5 font-semibold' >DAO Creation Steps</div>

                {/* completed */}
                <div className='flex flex-row items-center justify-start'>
                    <div className='w-7 h-7 mx-4 text-xs border rounded-full flex items-center justify-center bg-[#A7B9FC] border-[#A7B9FC]'>1</div>
                    <div className='text-xs font-semibold text-[#A7B9FC]'>
                        Choose your repository 
                    </div>
                </div>
                <div className='w-3.5 h-3.5 mx-4 border-r border-solid border-[#A7B9FC]'></div>

                {/* incomplete */}
                <div className='flex flex-row items-center justify-start'>
                    <div className='w-7 h-7 mx-4 text-xs border rounded-full flex items-center justify-center'>2</div>
                    <div className='text-xs font-semibold'>
                        Customize your token
                    </div>
                </div>
                <div className='w-3.5 h-3.5 mx-4 border-r border-dashed'></div>

                <div className='flex flex-row items-center justify-start'>
                    <div className='w-7 h-7 mx-4 text-xs border rounded-full flex items-center justify-center'>3</div>
                    <div className='text-xs font-semibold'>
                        Set initial distribution 
                    </div>
                </div>
                <div className='w-3.5 h-3.5 mx-4 border-r border-dashed'></div>

                <div className='flex flex-row items-center justify-start'>
                    <div className='w-7 h-7 mx-4 text-xs border rounded-full flex items-center justify-center'>4</div>
                    <div className='text-xs font-semibold'>
                        Confirm DAO Creation 
                    </div>
                </div>

            </div>
        );
}

export default CreationSteps;