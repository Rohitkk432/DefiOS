import React from 'react'

import {ClockIcon} from '@heroicons/react/outline'
import {XCircleIcon} from '@heroicons/react/solid'


interface ActionableItemsProps {

}

const ActionableItems: React.FC<ActionableItemsProps> = ({}) => {
    return (
        <div className='h-[15vh] w-[98%] mb-[4%] rounded-md bg-[#121418] py-[4%] px-[6%]'>
            <div className='text-[1.6vh] text-[#CACACA] mb-[5%]'>
                Lorem ipsum dolor sit of amet, consectetur is my adipiscing elit sed do eiusmod tempor incidid
            </div>
            <div className='w-full flex flex-row justify-between items-center' >
                <div className='flex flex-row justify-start items-center w-[90%]'>
                    <ClockIcon className='h-[2.5vh] w-[2.5vh] mr-[2%]'/>
                    <div className='text-[1.6vh] text-[#CACACA]' >09:40 22/08/2022</div>
                </div>
                <XCircleIcon className='h-[2.5vh] w-[2.5vh]'/>
            </div>
        </div>
    );
}

export default ActionableItems;