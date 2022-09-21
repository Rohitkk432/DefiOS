import React from 'react'
import {useState,useEffect} from 'react'
import Head from 'next/head'

import DashboardMenu from '../../components/DashboardMenu';
import DaoDetailsBottom from '../../components/DaoDetailsBottom';

import IssueAction from '../../components/IssuePopups/IssueAction'
import IssueVote from '../../components/IssuePopups/IssueVote'
import IssueReward from '../../components/IssuePopups/IssueReward'
import NewIssue from '../../components/IssuePopups/NewIssue'

// import {useRouter} from 'next/router';

import {ethers} from 'ethers'
declare let window:any
import contractAbi from "../../components/ContractFunctions/DaoFactoryABI.json"
// import DaoAbi from "../../components/ContractFunctions/DaoABI.json"

import Joyride, { CallBackProps, STATUS } from 'react-joyride';

interface DaoDetailsProps {

}

const DaoDetails: React.FC<DaoDetailsProps> = ({}) => {

    // const router = useRouter();
    // let {id} = router.query;

    const [popupState, setPopupState] = useState<string>('none')
    const [popupIssue, setPopupIssue] = useState<number>(0)
    const [popupIssueID, setPopupIssueID] = useState<number>(0)

    const [DaoInfo, setDaoInfo] = useState<any>()

    const contractAddress:any = process.env.NEXT_PUBLIC_DEFIOS_CONTRACT_ADDRESS;

    const [runTour,setRunTour] = useState(false)

    const tourSteps:any = [
        {
            target: '.dao-details__step1',
            content: 'Convert your existing repository into a DAO with project native tokens and use them to incentivize community members and power users to contribute to your project.',
            placement: 'bottom-end',
            offset: 0,
            
        },
        {
            target: '.dao-details__step2',
            content: 'Convert your existing repository into a DAO with project native tokens and use them to incentivize community members and power users to contribute to your project.',
            placement: 'bottom-end',
            offset: 0,
            
        },
        {
            target: '.dao-details__step3',
            content: 'Check out the top repositories converted into DAOs by all users of DefiOS. Filter them to your liking and contribute by creating issues and staking tokens behind them or resolving the issues.',
            placement: 'bottom-end',
            offset: 0,
        },
        {
            target: '.dao-details__step4',
            content: 'Explore the activity on the repositories you converted into DAOs. Push commit histories on-chain, vote on PRs, create issues, merge PRs, and redeem rewards.',
            placement: 'bottom-end',
            offset: 0,
        },
    ]

    const initDaoData = async()=>{
        let doaID = window.location.pathname.split('/')[2]
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let defiosContract : ethers.Contract = new ethers.Contract(contractAddress, contractAbi, signer);
        const daoInfo = await defiosContract.getDAOInfo(doaID)

        // let DaoContract : ethers.Contract = new ethers.Contract(daoInfo.DAOAddress, DaoAbi , signer);
        const DaoInfoObj = {
            "DaoId":doaID,
            "DAO":daoInfo.DAOAddress,
            "owner":daoInfo.owner,
            "team":daoInfo.team,
            "metadata":daoInfo.metadata,
        }
        DaoInfoObj.metadata = await fetch(`https://gateway.ipfs.io/ipfs/${DaoInfoObj.metadata}`).then(res=>res.json())
        DaoInfoObj.metadata.tokenImg = `https://gateway.ipfs.io/ipfs/${DaoInfoObj.metadata.tokenImg}`

        // console.log(DaoInfoObj)
        setDaoInfo(DaoInfoObj)
    }

    useEffect(()=>{
        const tourDone:any = localStorage.getItem('daoDetailsTourDone');
        if(tourDone==="false"||tourDone===undefined||tourDone===null){
            setRunTour(true);
        }
        if(popupIssue===0){
            initDaoData()
            const popupStateStorage = localStorage.getItem('popupState')||'none'
            setPopupState(popupStateStorage)
        }
        if(popupIssue!==0){
            setPopupIssueID(popupIssue)
        }
    },[popupIssue])

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        
        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            localStorage.setItem('daoDetailsTourDone',"true");
        }
    };

    return (
        <div className='w-[100vw] h-screen overflow-hidden bg-[#303C4A] flex flex-row justify-start items-start overflow-x-hidden'>
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
                    width:"55vh",
                    height:"30vh",
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
                    overflow:"hidden",
                },
                overlayLegacy: {
                    padding:0,
                    margin:0,
                    height:"100vh",
                    width:"100vw",
                    overflow: 'hidden',
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
                <title>DAO Details</title>
            </Head>

            <DashboardMenu DaoInfo={DaoInfo} />

            <div className='overflow-y-scroll w-[80%] h-full customScrollbar'>
                <DaoDetailsBottom setRunTour={setRunTour} runTour={runTour} setPopupIssue={setPopupIssue} DaoInfo={DaoInfo} popupState={popupState}  setPopupState={setPopupState}/>
            </div>

            {
            (popupState === 'issueAction')?
                <IssueAction popupIssueID={popupIssueID} DaoInfo={DaoInfo} setPopupState={setPopupState}/>:
            (popupState === 'issueVote')?
                <IssueVote popupIssueID={popupIssueID} DaoInfo={DaoInfo} setPopupState={setPopupState}/>:
            (popupState === 'issueReward')?
                <IssueReward popupIssueID={popupIssueID} DaoInfo={DaoInfo} setPopupState={setPopupState}/>:
            (popupState === 'newIssue')?
                <NewIssue DaoInfo={DaoInfo} setPopupState={setPopupState}/>:null
            }
        </div>
    );
}

export default DaoDetails;