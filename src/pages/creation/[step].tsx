import React from 'react'
import { useState,useEffect } from 'react'
import Head from 'next/head'

import {useRouter} from 'next/router';

import CreationSteps from '../../components/DaoCreation/CreationSteps';
import CreationSummary from '../../components/DaoCreation/CreationSummary';
import CreationProcess from '../../components/DaoCreation/CreationProcess';

import CreationChooseRepo from '../../components/DaoCreation/CreationChooseRepo';
import CreationChooseToken from '../../components/DaoCreation/CreationChooseToken';
import CreationDistribution from '../../components/DaoCreation/CreationDistribution';
import CreationConfirm from '../../components/DaoCreation/CreationConfirm';

import Joyride, { CallBackProps, STATUS } from 'react-joyride';

import { XIcon,SupportIcon } from '@heroicons/react/outline';

interface creationProps {

}

const Creation: React.FC<creationProps> = ({}) => {
    const router = useRouter();
    let {step} = router.query;

    const [tourSteps,setTourSteps] = useState<any>([]);

    const [runTour,setRunTour] = useState(false)

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
        
        const tourDone:any = localStorage.getItem('tourDone');
        if(typeof step === 'string'){
            if(parseInt(tourDone)<parseInt(step) ||tourDone===undefined||tourDone===null){
                setRunTour(true);
            }
        }
    },[triggerToMain,startCreation,tourSteps]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        
        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            if(typeof step === 'string'){
                localStorage.setItem('tourDone',step);
            }
        }
    };

    return (
        <div className='flex flex-row justify-center items-center w-screen h-screen bg-[#303C4A]'>
            <div className='flex flex-row justify-center items-center bg-[#303C4A] w-[calc(16/9*98vh)] h-[98vh] rounded-2xl z-0'>

                {runTour &&
                <Joyride
                callback={handleJoyrideCallback}
                hideCloseButton
                disableOverlayClose={true}
                showProgress
                showSkipButton
                continuous
                run={runTour}
                steps={tourSteps}
                spotlightPadding={5}
                styles={{
                    beacon: {
                        height: '5vh',
                        width: '5vh',
                    },
                    tooltip: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: "2vh",
                        margin:0,
                        width:"45vh",
                        height:"25vh",
                        borderRadius: "1.5vh",
                    },
                    tooltipContainer:{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding:0,
                        margin:0
                    },
                    tooltipTitle: {
                        fontSize: '2.2vh',
                        margin: '1vh',
                        padding:0,
                    },
                    tooltipContent: {
                        fontSize: '2.2vh',
                        margin: '1vh',
                        padding:0,
                    },
                    tooltipFooter: {
                        width: '100%',
                        height: '10vh',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding:0,
                        margin:0
                    },
                    buttonNext: {
                        fontSize:'1.8vh',
                        margin: 0 ,
                        padding: "1.5vh 2vh",
                        borderRadius: "0.5vh",
                    },
                    buttonBack: {
                        fontSize:'1.8vh',
                        margin: 0 ,
                        padding: "1.5vh 2vh",
                        borderRadius: "0.5vh",
                    },
                    buttonClose: {
                        fontSize:'1.8vh',
                        margin: 0 ,
                        padding: "1.5vh 2vh",
                        borderRadius: "0.5vh",
                        display: 'none',
                    },
                    buttonSkip: {
                        fontSize:'1.8vh',
                        margin: 0 ,
                        padding: "1.5vh 2vh",
                        borderRadius: "0.5vh",
                    },
                    spotlight: {
                        padding:0,
                        margin:0,
                        borderRadius: "2vh",
                    },
                    spotlightLegacy: {
                        padding:0,
                        margin:0,
                        borderRadius: "2vh",
                    },
                    overlay: {
                        padding:0,
                        margin:0,
                        height:"100vh",
                        width:"100vw",
                    },
                    overlayLegacy: {
                        padding:0,
                        margin:0,
                        height:"100vh",
                        width:"100vw",
                    },
                    options: {
                        arrowColor: '#262B36',
                        backgroundColor: '#262B36',
                        primaryColor: '#91A8ED',
                        textColor: '#FFF',
                        zIndex: 1000,
                    }
                }}
                />
                }

                <Head>
                    <title>DAO Creation</title>
                </Head>

                {!startCreation &&
                <XIcon onClick={()=>{
                    localStorage.removeItem('DaoCreationData')
                    localStorage.removeItem('distributionOk')
                    router.push('/dashboard')
                }} className="h-[4vh] w-[4vh] text-white absolute top-[3vh] right-[3vh]"/>
                }
                {!startCreation &&
                <button className={`flex flex-row justify-center items-center 
                ${runTour?"text-gray-600":"text-white"}
                py-[1vh] rounded-[1vh] absolute bottom-[3vh] right-[3vh] text-white flex flex-row items-center justify-center`}
                onClick={()=>{
                    setRunTour(true);
                }}>
                    <SupportIcon className="h-[3.5vh] w-[3.5vh] mr-[1vh]"/>
                    <div className='text-[2.8vh] font-semibold'>Tutorial</div>
                </button>
                }

                <CreationSteps step={Number(step)} />

                {(Number(step)===1)?
                <CreationChooseRepo
                tourSteps={tourSteps}
                setTourSteps={setTourSteps} />
                :(Number(step)===2)?
                <CreationChooseToken
                tourSteps={tourSteps}
                setTourSteps={setTourSteps} />
                :(Number(step)===3)?
                <CreationDistribution 
                triggerToMain={triggerToMain} 
                setTriggerToMain={setTriggerToMain}
                tourSteps={tourSteps}
                setTourSteps={setTourSteps} />
                :(Number(step)===4)?
                <CreationConfirm
                startCreation={startCreation}
                setStartCreation={setStartCreation}
                tourSteps={tourSteps}
                setTourSteps={setTourSteps} />
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