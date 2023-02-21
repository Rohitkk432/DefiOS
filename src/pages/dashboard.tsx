import React from 'react'
import {useState, useEffect} from 'react'
import Head from 'next/head'

import DashboardMenu from '../components/DashboardMenu';
import DashboardMain from '../components/DashboardMain';

import LoginOverlay from '../components/utils/LoginOverlay';

import {ethers} from 'ethers'
import { useSession } from "next-auth/react";

import Joyride, { CallBackProps, STATUS } from 'react-joyride';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFaucet} from '@fortawesome/free-solid-svg-icons';

interface DashboardProps {

}

declare let window:any

const Dashboard: React.FC<DashboardProps> = ({}) => {
    const {data:session} = useSession()

    const [load, setLoad] = useState(false)

    const [currentAccount, setCurrentAccount] = useState<string | undefined>()
    const [network, setNetwork] = useState<string | undefined>()
    const [chainId, setChainId] = useState<number | undefined>()

    const [runTour,setRunTour] = useState(false)

    const tourSteps:any = [
        {
            target: '.dash__step1',
            title: 'Welcome to DefiOS 🙏',
            content: (
                <div className='flex flex-col items-center justify-center'>
                    <div>
                        This is a p2p protocol to add liquidity to open source communities. Earn crypto rewards by contributing to open source repositories or convert your own repository into a token and reward people for helping you build code. Get started now.
                    </div>
                    <a href="https://neonfaucet.org/" target="_blank" className='border-2 text-[3vh] border-[#91A8ED] mt-[4vh] px-[8vh] py-[2vh] 
                    rounded-[1vh] flex flex-row justify-center items-center'>
                        <FontAwesomeIcon icon={faFaucet} className='h-[3vh] mr-[2vh]'/>
                        <div>Get Devnet NEON</div>
                    </a>
                </div>
            ),
            placement: 'center',
            offset: 0,
            styles:{
                tooltip: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: "3vh 5vh",
                    margin:0,
                    width:"75vw",
                    height:"52vh",
                    overflow: 'hidden',
                    borderRadius: "1.5vh",
                },
                tooltipTitle: {
                    fontSize: '6vh',
                    fontWeight: 700,
                },
                tooltipContent: {
                    fontSize: '3.15vh',
                    fontWeight: 400,
                },
            }
        },
        {
            target: '.dash__step2',
            content: 'Convert your existing repository into a DAO with project native tokens and use them to incentivize community members and power users to contribute to your project.',
            placement: 'bottom-end',
            offset: 0,
            
        },
        {
            target: '.dash__step3',
            content: 'Check out the top repositories converted into DAOs by all users of DefiOS. Filter them to your liking and contribute by creating issues and staking tokens behind them or resolving the issues.',
            placement: 'bottom-end',
            offset: 0,
        },
        {
            target: '.dash__step4',
            content: 'Explore the activity on the repositories you converted into DAOs. Push commit histories on-chain, vote on PRs, create issues, merge PRs, and redeem rewards.',
            placement: 'bottom-end',
            offset: 0,
        },
    ]

    const GithubUID_Address_mapping = async () => {

        const github_uid = session?.user?.image?.split('/')[4]?.split("?")[0] 
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "pub_key": localStorage.getItem('currentAccount'),
                    "github_uid": github_uid,
                    "github_access_token": (session as any)?.accessToken
                }
            )
        };
        const returnSig = await fetch('https://names.defi-os.com/encrypt',requestOptions)
        .then(res=>res.status===200?res.json():null)
        .then(res=>{
            return res.signature
        })
        .catch(err=>console.log(err))
        if(returnSig!==undefined && returnSig!==null){
            localStorage.setItem('mappingDone','true')
        }
        return returnSig
    }

    useEffect(() => {
        const tourDone:any = localStorage.getItem('dashTourDone');
        if(tourDone==="false"||tourDone===undefined||tourDone===null){
            setRunTour(true);
            return
        }

        let accountInStorage:any= localStorage.getItem("currentAccount")
        if(session && localStorage.getItem('mappingDone')===null && accountInStorage!==null){
            GithubUID_Address_mapping();
        }

        if(!(window.ethereum && accountInStorage!==null)){
            setLoad(true)
            // console.log(currentAccount)
            return
        }
        if(accountInStorage){
            setCurrentAccount(accountInStorage)
            onClickConnect();
            setLoad(false)
            return
        }
        if(currentAccount && ethers.utils.isAddress(currentAccount)){
            onClickConnect();
            setLoad(false)
            return
        }
        window.ethereum.on('accountsChanged', () => {
            onClickConnect();
        });
        window.ethereum.on('chainChanged', () => {
            onClickConnect();
        });
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
    },[currentAccount,session])

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        
        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            setLoad(true);
            localStorage.setItem('dashTourDone',"true");
        }
    };

    const onClickConnect = () => {
        //client side code
        if(!window.ethereum) {
            console.log("please install MetaMask")
            return
        }

        //we can do it using ethers.js
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // MetaMask requires requesting permission to connect users accounts
        provider.send("eth_requestAccounts", [])
        .then((accounts)=>{
            if(accounts.length>0){
                setCurrentAccount(accounts[0])
                localStorage.setItem("currentAccount",accounts[0])
            }
        })
        .catch((e)=>console.log(e))

        provider.getNetwork().then(network => {
            setNetwork(network.name)
            setChainId(network.chainId)
        }).catch(err => {
            console.log(err)
        })

    }

    // const onClickDisconnect = () => {
    //     console.log("onClickDisConnect")
    //     localStorage.removeItem("currentAccount")
    //     setCurrentAccount(undefined)
    // }

    return (
        <div className='overflow-hidden w-screen h-screen'>
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
        <div className='dash__step1 w-screen h-screen bg-[#303C4A] flex flex-row justify-start items-start overflow-hidden'>
            <Head>
                <title>Dashboard</title>
            </Head>
            <DashboardMenu/>
            <DashboardMain runTour={runTour} setRunTour={setRunTour} currentAccount={currentAccount} network={network} chainId={chainId}/>
        </div>
        <LoginOverlay load={load} onClickConnect={onClickConnect} />
        </div>
    );
}

export default Dashboard;