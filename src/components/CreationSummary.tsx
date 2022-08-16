import React from 'react'

import { InformationCircleIcon } from '@heroicons/react/outline';

interface CreationSummaryProps {

}

const CreationSummary: React.FC<CreationSummaryProps> = ({}) => {
    return (
        <div className='w-[15rem] h-[20rem] bg-[#121418] rounded-2xl text-white flex flex-col items-center justify-between'>
            <div className='w-[90%] text-sm border-b border-[#9D9D9D] pt-3 pb-2 pl-1 mb-5 text-left' >Initial Token Distribution</div>
            <div className='pb-4 text-center' >
                <div className='text-xs font-bold' >Total token supply <InformationCircleIcon className='w-4 h-4 inline'/></div>
                <div className='text-sm' >100M Tokens</div>
            </div>
        </div>
    );
}

export default CreationSummary;