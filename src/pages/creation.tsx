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
        <div className='flex flex-row justify-center items-center bg-[#303C4A] w-screen h-screen relative'>
            <Link
                href="/"
            >
                <XIcon className="h-6 w-6 text-white absolute top-5 right-5"/>
            </Link>

            <CreationSteps />
            <CreationMain />
            <CreationSummary />
        </div>
    );
}

export default Creation;