import React from 'react'
import {useState,useEffect} from 'react'
import LoadingScreen from './utils/LoadingScreen'
// import ActionableItems from './ActionableItems'

import {useSession} from 'next-auth/react'
import Link from 'next/link'

import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "./ContractFunctions/DaoABI.json"
import TokenAbi from "./ContractFunctions/TokenABI.json"


interface DashboardMenuProps {
    DaoInfo?:any
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({DaoInfo}) => {

    const [load, setLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>()
    const [successMsg, setSuccessMsg] = useState<string>()

    const {data:session} = useSession()

    const [ claimRender , setClaimRender ] = useState(false);
    const [githubUID, setGithubUID] = useState<string>()

    const claimTokens = async () => {
        if(githubUID===undefined || !claimRender) return
        setLoad(true)
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);
        
        const DaoTokenAddress = await DaoContract.TOKEN();
        let TokenContract : ethers.Contract = new ethers.Contract(DaoTokenAddress, TokenAbi , signer);

        let txRes = false;
        const tx = await TokenContract.claimShare(githubUID).then((res:any)=>{
            setSuccessMsg("Claimed Tokens")
            return res;
        }).catch((err:any)=>{
            if(err.error===undefined){
                setErrorMsg('Transaction Rejected')
            }else{
                setErrorMsg(err.error.data.message)
            }
        })
        if(txRes){
            await tx.wait();
        }
    }

    const checkIfUnclaimed = async()=>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${session?.accessToken}` },
        };
        const idGithub = await fetch('https://api.github.com/user',requestOptions).then(res=>res.json())
        .then(res=>{
            for(let i=0;i<DaoInfo.team.length;i++){
                if(res.id.toString()===DaoInfo.team[i]){
                    setGithubUID(res.id.toString())
                    return res.id.toString();
                }
            }
        });
        // web3
        if(idGithub===undefined) return
        
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);
        
        const DaoTokenAddress = await DaoContract.TOKEN();
        let TokenContract : ethers.Contract = new ethers.Contract(DaoTokenAddress, TokenAbi , signer);

        const checkUnclaimed = await TokenContract.partner(idGithub)
        
        if(!checkUnclaimed.claimed){
            setClaimRender(true)
        }
    }

    useEffect(()=>{
        if (session && DaoInfo!==undefined){
            checkIfUnclaimed();
        }
    },[DaoInfo])

    return (
        <div className='w-[20%] h-full bg-[#191C21] flex flex-col justify-start items-center px-[1.5%] py-[1%] pt-[7%] relative text-white'>
            <Link href='/dashboard'>
                <img src="/assets/images/defi-os-logo.png" className='h-[6vh] absolute top-[2.5vh] left-[6%]' />
            </Link>
            <img src={session?.user?.image || ''} className='h-[9vh] mb-[2vh] rounded-full' />
            <div className='text-[#CACACA] mb-[4vh] text-[2.5vh]'>Hey! {session?.user?.name || ''}</div>
            
            {/* options */}
            <div className='w-full h-[4.5vh] mb-[1vh] rounded-md bg-[#121418] flex flex-row justify-between items-center px-[7%]'>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/userCheckIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Active Since</div>
                </div>
                <div className='text-[1.6vh] w-[25%] text-center' >10 days</div>
            </div>
            <a href="https://github.com/" target="_blank" className='w-full h-[4.5vh] mb-[1vh] rounded-md flex flex-row justify-between items-center px-[7%] hover:border hover:border-gray-400 '>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/bulbPuzzleIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Biggest Solve</div>
                </div>
            </a>
            <div className='w-full h-[4.5vh] mb-[1vh] rounded-md flex flex-row justify-between items-center px-[7%]'>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/solvingIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Total Issues Solved</div>
                </div>
                <div className='text-[1.6vh] w-[25%] text-center' >-</div>
            </div>
            <div className='w-full h-[4.5vh] mb-[1vh] rounded-md flex flex-row justify-between items-center px-[7%]'>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/DaoIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Total DAOs created</div>
                </div>
                <div className='text-[1.6vh] w-[25%] text-center' >-</div>

            </div>
            <div className='w-full h-[4.5vh] mb-[1vh] rounded-md flex flex-row justify-between items-center px-[7%]'>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/earningIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Total earnings</div>
                </div>
                <div className='text-[1.6vh] w-[25%] text-center' >-</div>
            </div>

            {/* <div className='w-full text-left text-[2vh] mt-[4%] mb-[4%] text-[#CACACA]' >Actionable Items</div>
            <div className='w-full h-[40%] overflow-y-scroll customScrollbar'>
                <ActionableItems />
                <ActionableItems />
                <ActionableItems />
            </div> */}

            {claimRender && 
                <button className='flex flex-row justify-center items-center bg-[#91A8ED] w-full py-[2.5%] rounded-[1vh] text-[2.7vh] mt-[1vh]' onClick={()=>claimTokens()} >
                    <div>Claim Tokens</div>
                </button>
            }

            <LoadingScreen load={load} setLoad={setLoad} error={errorMsg} success={successMsg} />
        </div>
    );
}

export default DashboardMenu;