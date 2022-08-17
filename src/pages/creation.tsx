import React from 'react'
import Link from 'next/link';

import CreationSteps from '../components/CreationSteps';
import CreationMain from '../components/CreationMain';
import CreationSummary from '../components/CreationSummary';

import { XIcon } from '@heroicons/react/outline';

interface creationProps {

}

const Creation: React.FC<creationProps> = ({}) => {
    return (
        <div className='flex flex-row justify-center items-center w-screen h-screen bg-black'>
            <div className='flex flex-row justify-center items-center bg-[#303C4A] w-[calc(16/9*98vh)] h-[98vh] relative rounded-2xl'>
                <Link
                    href="/"
                >
                    <XIcon className="h-[4vh] w-[4vh] text-white absolute top-[3vh] right-[3vh]"/>
                </Link>

                <CreationSteps />
                <CreationMain />
                <CreationSummary />
            </div>
        </div>
    );
}

export default Creation;