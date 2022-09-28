import React from 'react'
import {useState,useEffect} from 'react'
import LoadingScreen from './utils/LoadingScreen'
import PopupScreen from './utils/PopupScreen'
// import ActionableItems from './ActionableItems'

import {useSession} from 'next-auth/react'
import Link from 'next/link'

import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "./ContractFunctions/DaoABI.json"
import TokenAbi from "./ContractFunctions/TokenABI.json"

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRotate,faRocket,faFaucet} from '@fortawesome/free-solid-svg-icons';


interface DashboardMenuProps {
    DaoInfo?:any
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({DaoInfo}) => {

    const [load, setLoad] = useState(false)
    const [popLoad, setPopLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>()
    const [successMsg, setSuccessMsg] = useState<string>()

    const {data:session} = useSession()
    const [btnLoader, setBtnLoader] = useState(false)
    const [ claimRender , setClaimRender ] = useState(false);
    const [githubUID, setGithubUID] = useState<string>()
    const [syncCommitBtn, setSyncCommitBtn] = useState(false)

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
        
        if(!checkUnclaimed.claimed && Number(checkUnclaimed.amount)!==0){
            setClaimRender(true)
        }
    }

    useEffect(()=>{
        if (session && DaoInfo!==undefined){
            setBtnLoader(true)
            checkIfUnclaimed();
            if(DaoInfo.owner.toLowerCase()===localStorage.getItem('currentAccount')?.toLowerCase()){
                setSyncCommitBtn(true)
            }
            setBtnLoader(false)
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
            <div className='mt-auto w-full'>
            {claimRender && !btnLoader && DaoInfo!==undefined &&
                <button className='flex flex-row justify-center items-center border-2 border-[#91A8ED] w-full py-[2.5%] rounded-[1vh] text-[2vh] mb-[2vh]' onClick={()=>claimTokens()} >
                    <div>Claim {DaoInfo.metadata.tokenSymbol}</div>
                </button>
            }
            {syncCommitBtn && !btnLoader && DaoInfo!==undefined &&
                <button className='dao-details__step5 flex flex-row justify-center items-center bg-[#91A8ED] w-full py-[2.5%] rounded-[1vh] text-[2vh] mb-[1vh]'>
                    <FontAwesomeIcon icon={faRotate} className='h-[2vh] mr-[3%]'/>
                    <div>Sync Commit History</div>
                </button>
            }
            </div>

            {DaoInfo===undefined && !btnLoader &&
            <div className='mt-auto w-full'>
                <a href="https://neonfaucet.org/" target="_blank" className='flex flex-row justify-center items-center border-2 border-[#91A8ED] w-full py-[2.5%] rounded-[1vh] text-[2vh]  mb-[2vh]'>
                    <FontAwesomeIcon icon={faFaucet} className='h-[2vh] mr-[3%]'/>
                    <div>Get Devnet NEON</div>
                </a>
                <button className='flex flex-row justify-center items-center bg-[#91A8ED] w-full py-[2.5%] rounded-[1vh] text-[2vh]  mb-[1vh]' onClick={()=>setPopLoad(true)} >
                    <FontAwesomeIcon icon={faRocket} className='h-[2vh] mr-[3%]'/>
                    <div>DefiOS Alpha</div>
                </button>
            </div>
            }
            {btnLoader &&
                <div className='w-full my-[3vh] flex flex-row items-center justify-center' >
                    <svg aria-hidden="true" className="w-[5vh] h-[5vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <div className='text-[2.5vh] ml-[2vh]' >Loading Buttons</div>
                </div>
            }

            <LoadingScreen load={load} setLoad={setLoad} error={errorMsg} success={successMsg}
            redirectURL='' />
            <PopupScreen load={popLoad} setLoad={setPopLoad} />
        </div>
    );
}

export default DashboardMenu;