import React from 'react'
import { useState,useEffect } from 'react'

import Link from 'next/link';
import {useRouter} from 'next/router';

import CreationSteps from '../../components/DaoCreation/CreationSteps';
import CreationSummary from '../../components/DaoCreation/CreationSummary';
import CreationProcess from '../../components/DaoCreation/CreationProcess';

import CreationChooseRepo from '../../components/DaoCreation/CreationChooseRepo';
import CreationChooseToken from '../../components/DaoCreation/CreationChooseToken';
import CreationDistribution from '../../components/DaoCreation/CreationDistribution';
import CreationConfirm from '../../components/DaoCreation/CreationConfirm';

import { XIcon } from '@heroicons/react/outline';

interface creationProps {

}

const Creation: React.FC<creationProps> = ({}) => {
    const router = useRouter();
    let {step} = router.query;

    //trigger to send refresh signal from one branch to another in component tree 
    //triggers
    const [triggerToMain,setTriggerToMain] = useState(1);
    const [triggerToSummary,setTriggerToSummary] = useState(1);

    const [startCreation,setStartCreation] = useState(false);
    const [creationStarter,setCreationStarter] = useState(false);   
    //triggering mechanism
    useEffect(() => {
        if(triggerToMain>1){
            setTriggerToSummary(triggerToSummary+1);
        }
        if(!creationStarter && startCreation){
            setCreationStarter(true);
        }
    },[triggerToMain,startCreation]);

    return (
        <div className='flex flex-row justify-center items-center w-screen h-screen bg-[#303C4A]'>
            <div className='flex flex-row justify-center items-center bg-[#303C4A] w-[calc(16/9*98vh)] h-[98vh] rounded-2xl z-0'>
                <Link
                    href="/dashboard"
                >
                    <XIcon className="h-[4vh] w-[4vh] text-white absolute top-[3vh] right-[3vh]"/>
                </Link>

                <CreationSteps step={Number(step)} />

                {(Number(step)===1)?
                <CreationChooseRepo />
                :(Number(step)===2)?
                <CreationChooseToken />
                :(Number(step)===3)?
                <CreationDistribution 
                triggerToMain={triggerToMain} 
                setTriggerToMain={setTriggerToMain} />
                :(Number(step)===4)?
                <CreationConfirm
                startCreation={startCreation}
                setStartCreation={setStartCreation} />
                :null
                }

                {(Number(step)<4)?
                <CreationSummary step={Number(step)} 
                triggerToSummary={triggerToSummary} 
                setTriggerToSummary={setTriggerToSummary} />
                :<CreationProcess creationStarter={creationStarter} />
                }
            </div>
        </div>
    );
}

export default Creation;