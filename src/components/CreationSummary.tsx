import React from 'react'

import { InformationCircleIcon } from '@heroicons/react/outline';

interface CreationSummaryProps {

}

const CreationSummary: React.FC<CreationSummaryProps> = ({}) => {

    const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';

    return (
        <div 
        className='w-[19.5%] h-[42.2%] bg-[#121418] rounded-2xl text-white flex flex-col items-center justify-between'
        >
            <div className={`w-[90%] ${fontsizer} border-b border-[#9D9D9D] pb-[4%] pl-[1%] pt-[6%] mb-[8%] text-left`} >Initial Token Distribution</div>
            <div className='pb-[6%] text-center' >
                <div className={`${fontsizer2} font-bold`} >Total token supply <InformationCircleIcon className='w-[4%] h-[4%] inline'/></div>
                <div className={fontsizer} >100M Tokens</div>
            </div>
        </div>
    );
}

export default CreationSummary;