import React from 'react'
import {useState,useEffect} from 'react'
import {useSession} from 'next-auth/react'
import LoadingScreen from '../utils/LoadingScreen'

import { XIcon } from '@heroicons/react/outline';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import Tags from '../utils/Tags'
import IssueState from '../utils/IssueState'

import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "../ContractFunctions/DaoABI.json"
import TokenAbi from "../ContractFunctions/TokenABI.json"

import BlueShades from '../utils/BlueShades.json'

import {timeAgo} from '../../utils/timeUtils'

interface IssueActionProps {
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
    DaoInfo: any;
    popupIssueID: number;
}

interface PieChartProps{
    pieData: any;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChartProps> = ({pieData}) => {
    const pieColors = BlueShades.slice(4);

    const options = {
        plugins: {
            tooltip: {
                enabled: false,
            }
        }
    }

    const data = {
        datasets: [
            {
                data: pieData,
                backgroundColor: pieColors,
                borderWidth: 0,
                
            },
        ],
    };

    const nullData = {
        datasets: [
            {
                data: [1],
                backgroundColor: ['#7B7C7D'],
                borderWidth: 0,
                
            },
        ],
    };

    return (
        <div className='w-[40%] mb-[2%]'>
            <Doughnut data={(pieData.length===1 && pieData[0]===0)?nullData:data} options={options} />
        </div>
    )
}

const IssueAction: React.FC<IssueActionProps> = ({setPopupState,DaoInfo,popupIssueID}) => {

    const [load, setLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>()
    const [processName, setProcessName] = useState<string>()
    const [successMsg, setSuccessMsg] = useState<string>()

    const {data:session} = useSession()

    const [IssuesList,setIssuesList] = useState<any>()
    const [addStake,setAddStake] = useState<number>()

    const [PrLink,setPrLink] = useState<string>('')

    const compactNum = (num:number)=>{
        const formatter = Intl.NumberFormat('en',{notation:'compact'});
        return formatter.format(num);
    }

    const getTheIssue = async () => {
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);
        const issueRes = await DaoContract.repoIssues(popupIssueID);

        //getting stakers data for PieChart
        const stakersRes = [];
        const stakesArr = [];
        let _calcTotalStaked = 0;
        let _doCalc = true;
        let _calcIndex = 0;
        while(_doCalc){
            const stakersOne = await DaoContract.stakers(popupIssueID,_calcIndex);
            _calcTotalStaked += Number(stakersOne.amount);
            stakersRes.push(stakersOne);
            stakesArr.push(Number(stakersOne.amount));
            if(_calcTotalStaked === Number(issueRes.totalStaked)){
                _doCalc=false
            }
            _calcIndex++;
        }

        //metadata of DAO
        const DaoMetadata = await DaoContract.METADATA();
        const DaoRes = await fetch(`https://gateway.ipfs.io/ipfs/${DaoMetadata}`).then(res=>res.json());
        DaoRes.tokenImg = `https://gateway.ipfs.io/ipfs/${DaoRes.tokenImg}`

        //Token Balance of user
        const DaoTokenAddress = await DaoContract.TOKEN();
        let TokenContract : ethers.Contract = new ethers.Contract(DaoTokenAddress, TokenAbi , signer);
        const userTokenBalance = ethers.utils.formatEther(await TokenContract.balanceOf(await signer.getAddress()));

        const apiURL = await issueRes.issueURL.replace('github.com','api.github.com/repos');
        const githubRes = await fetch(apiURL,{
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${(session as any)?.accessToken}` },
                    }).then(res=>res.json()).catch(err=>console.log(err));
        const IterIssue = {
            tokenBalance: userTokenBalance,
            stakesArr : stakesArr,
            stakersInfo: stakersRes,
            issueInfo:issueRes,
            githubInfo: githubRes,
            daoInfo: DaoRes,
        }
        // console.log(IterIssue)
        setIssuesList(IterIssue);
    }

    const StakeOnIssueFunc = async () => {
        if(addStake===undefined) return
        setLoad(true);
        setProcessName('Staking on Issue')
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        const DaoTokenAddress = await DaoContract.TOKEN();
        let TokenContract : ethers.Contract = new ethers.Contract(DaoTokenAddress, TokenAbi , signer);

        //increase allowance
        setProcessName('Increasing Allowance to Transfer Tokens')
        let txRes = false;
        const tx = await TokenContract.increaseAllowance(DaoInfo.DAO,ethers.utils.parseEther(addStake.toString()))
        .then((res:any)=>{
            txRes = true;
            return res
        })
        .catch((err:any)=>{
            if(err.error===undefined){
                setErrorMsg('Transaction Rejected')
            }else{
                setErrorMsg(err.error.data.message)
            }
        });
        if(txRes){
            await tx.wait();
        }
        
        //stake
        setProcessName('Initiating Token transfer')
        txRes = false;
        const tx1 = await DaoContract.stakeOnIssue(popupIssueID,ethers.utils.parseEther(addStake.toString()))
        .then((res:any)=>{
            txRes = true;
            return res;
        })
        .catch((err:any)=>{
            if(err.error===undefined){
                setErrorMsg('Transaction Rejected')
            }else{
                setErrorMsg(err.error.data.message)
            }
        });
        if(txRes){
            await tx1.wait();
            setSuccessMsg('Issue Staked Successfully')
        }
    }

    // const StartVotingFunc = async () => {
    //     if(Number(IssuesList.issueInfo.totalStaked)===0) return
    //     setLoad(true);
    //     setProcessName('Starting Voting Process')    
    //     //web3
    //     let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
    //     let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
    //     let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

    //     //start voting
    //     let txRes = false;
    //     const tx = await DaoContract.startVoting(popupIssueID)
    //     .then((res:any)=>{
    //         txRes = true;
    //         return res;
    //     })
    //     .catch((err:any)=>{
    //         if(err.error===undefined){
    //             setErrorMsg('Transaction Rejected')
    //         }else{
    //             setErrorMsg(err.error.data.message)
    //         }
    //     });
    //     if(txRes){
    //         await tx.wait();
    //         setSuccessMsg('Voting Started Successfully')
    //     }
    // }

    const CheckIfCanBeContributor = () => {
        if(IssuesList===undefined) return
        for(let i=0;i<IssuesList.stakersInfo.length;i++){
            if(localStorage.getItem('currentAccount')!==null && localStorage.getItem('currentAccount')?.toLowerCase()===IssuesList.stakersInfo[i].staker.toLowerCase()){
                return false
            }
        }
        return true;
    }

    const AddPrContributor = async () => {
        if(PrLink==='') return
        if(!PrLink.startsWith('https://github.com')) return
        if(session===null || session===undefined) return
        if(localStorage.getItem('currentAccount')===null || localStorage.getItem('currentAccount')===undefined) return

        setLoad(true);
        setProcessName('Adding Contributor\'s PR')
        //PrChecker
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${(session as any)?.accessToken}` },
        };
        const GithubUser = await fetch('https://api.github.com/user',requestOptions).then(res=>res.json());

        const PrlinkBreakdown = PrLink.split('/');

        const PrDetails = await fetch(`https://api.github.com/repos/${PrlinkBreakdown[3]}/${PrlinkBreakdown[4]}/pulls/${PrlinkBreakdown[6]}`,{
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${(session as any)?.accessToken}` },
                    }).then(res=>res.json());

        if(PrDetails.user.login!==GithubUser.login){
            setLoad(false);
            return
        }

        const PrCommitDetails = await fetch(PrDetails.commits_url).then(res=>res.json());
        if(PrCommitDetails.length<4){
            setLoad(false);
            return
        }

        const ProofOfPR = [
            PrCommitDetails[0].sha,
            PrCommitDetails[1].sha,
            PrCommitDetails[PrCommitDetails.length-2].sha,
            PrCommitDetails[PrCommitDetails.length-1].sha
        ]
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        //add pr contributor
        let txRes = false;
        const tx = await DaoContract.addCollaborator(popupIssueID,PrLink,ProofOfPR)
        .then((res:any)=>{
            txRes = true;
            return res;
        })
        .catch((err:any)=>{
            if(err.error===undefined){
                setErrorMsg('Transaction Rejected')
            }else{
                setErrorMsg(err.error.data.message)
            }
        });
        if(txRes){
            await tx.wait();
            setSuccessMsg('Contributor Added Successfully')
        }
    }

    useEffect(()=>{
        if(DaoInfo!==undefined && popupIssueID!==0){
            getTheIssue();
            setAddStake(0);
        }
    },[DaoInfo,popupIssueID])

    return (
        <div className='w-full h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-20 
        flex items-center justify-center text-white' >
            <div className='w-[70vw] h-[75vh] bg-[#262B36] rounded-md 
            shadow-[0_4vh_4vh_5vh_rgba(0,0,0,0.3)] 
            flex flex-row items-center justify-between py-[1%] px-[1.5%]' >
                {IssuesList===undefined &&
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <svg aria-hidden="true" className="w-[5vh] h-[5vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <div className='text-[2.5vh] mt-[1vh]' >Loading</div>
                </div>
                }
                {IssuesList &&
                <>
                <div className='w-[66%] h-full flex flex-col justify-start items-start'>
                    <div className='flex flex-row items-center w-full flex-wrap text-[3.5vh] font-semibold' >
                        {IssuesList!==undefined && IssuesList.githubInfo.title}
                        <IssueState issueState='open' />
                    </div>
                    <div className='flex flex-row justify-between items-center w-full flex-wrap text-[2.5vh]' >
                        <div className='w-[45%] flex flex-row'>
                            <div className='' >Created by :</div> 
                            <div className=' ml-[2%] rounded-full text-gray-300 flex flex-row items-center' >
                                <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                                <div>/{IssuesList!==undefined && IssuesList.githubInfo.user.login}</div>
                            </div>
                        </div>
                        <div className='w-[45%] flex flex-row'>
                            <div className=' ml-[2%]' >Created at :</div> 
                            <div className=' ml-[2%] rounded-full text-gray-300' >
                                {IssuesList!==undefined && timeAgo(IssuesList.githubInfo.created_at)} ago
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center w-full flex-wrap' >
                        <div className='text-[2.5vh]' >Tags :</div>
                        {IssuesList!==undefined &&
                            IssuesList.githubInfo.labels.map((tag:any,idx:number)=>{
                                return <Tags tag={tag.name} key={idx} />
                            })
                        }
                    </div>
                    <div className='flex flex-row items-center w-full flex-wrap text-[2.5vh]' >
                        <div>Issue Url :</div> 
                        <a href={IssuesList!==undefined ? IssuesList.issueInfo.issueURL:''} target="_blank" className='ml-[2%] text-gray-300 flex flex-row items-center w-[80%]'>
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh]' />
                            <div className='underline' >{IssuesList!==undefined && IssuesList.issueInfo.issueURL.replace("https://github.com","")}</div>
                        </a>
                    </div>

                    <div className='w-full h-full overflow-y-scroll border border-white 
                    p-[2.2%] mt-[4%] rounded-[2vh] customScrollbar text-[2.3vh]'>
                        {IssuesList!==undefined && IssuesList.githubInfo.body}
                        {(IssuesList.githubInfo.body===null) &&
                            <div className='text-gray-500' >No description available</div>
                        }
                    </div>
                    
                    {CheckIfCanBeContributor() && 
                    <div className='flex flex-row justify-start items-start w-full mt-[2%]'>
                        <input type="text" placeholder='PR url' className={`bg-[#121418] w-full py-[1.2%] px-[4%] text-[2vh] font-semibold rounded-l-md border-[#3A4E70] border border-r-0`} value={PrLink} onChange={(e)=>setPrLink(e.target.value)} />
                        <button onClick={AddPrContributor} className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-[30%] py-[1%] rounded-r-[1vh] text-[2.4vh]'
                        >Add PR</button>
                    </div>
                    }

                    {/* {DaoInfo!==undefined && localStorage.getItem('currentAccount')!==null && 
                    DaoInfo.owner.toLowerCase()===localStorage.getItem('currentAccount')?.toLowerCase() && 
                    <div className='flex flex-row justify-start items-start w-full mt-[2%]'>
                        <button className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-[30%] py-[1%] rounded-[1vh] text-[2.7vh]'
                        onClick={StartVotingFunc} >Start Voting</button>
                    </div>
                    } */}

                </div>
                <div className='w-[32%] h-full flex flex-col justify-start items-end'>
                    <XIcon className='h-[4vh] mb-[4%]' 
                    onClick={()=>{
                        setPopupState('none')
                        localStorage.removeItem('popupState')
                    }}/>
                    <div className='w-full h-[91%] bg-gray-600 flex flex-col items-start justify-end 
                    py-[4%] px-[3%] rounded-[1vh] text-[2.5vh]' >
                        <div className='text-[3vh] mb-[2%]'>Top {IssuesList!==undefined && IssuesList.daoInfo.tokenSymbol} Stakers</div>

                        <div className='w-full h-[40%] flex flex-row justify-between items-center'>
                            <PieChart pieData={IssuesList!==undefined && IssuesList.stakesArr} />
                            <div className='flex flex-col items-center justify-center w-[60%] h-full customScrollbar overflow-y-scroll'>
                                {IssuesList!==undefined && 
                                    IssuesList.stakersInfo.map((staker:any,idx:number)=>{
                                        return(
                                            <div className={`w-[90%] my-[2%] text-[1.5vh] flex flex-row items-center justify-between`} key={idx} >
                                                <div className='font-semibold'
                                                style={{color:BlueShades[idx+4]}}>
                                                    {staker.staker.slice(0,5)+'...'+staker.staker.slice(37,42)}
                                                </div>
                                                <div className='font-semibold'>
                                                    {compactNum(parseInt(ethers.utils.formatEther(staker.amount)))} {IssuesList.daoInfo.tokenSymbol}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className='flex flex-row justify-center items-center border-2 border-[#91A8ED] w-full py-[2.5%] rounded-[1vh] mb-[8%] mt-[5%] text-[2.7vh]'>
                            <img src={IssuesList!==undefined && IssuesList.daoInfo.tokenImg || ''} className='w-[4.5vh] h-[4.5vh] mr-[3%] rounded-full' />
                            <div>{IssuesList!==undefined && compactNum(parseInt(ethers.utils.formatEther(IssuesList.issueInfo.totalStaked)))} {IssuesList!==undefined && IssuesList.daoInfo.tokenSymbol}</div>
                        </div>
                        <div className='flex flex-col w-full items-center mt-[2%] 
                        border border-b-0 rounded-t-[1vh] px-[3%] py-[1.5%]'>
                            <div className='w-full flex flex-row items-center justify-between mb-[2%]'>
                                <div className='text-[2.2vh] flex flex-row items-center justify-center' >
                                    <div className='mr-[2vh]' >Balance: </div>
                                    <div className='font-semibold'>{IssuesList!==undefined && Math.round(IssuesList.tokenBalance)}</div>
                                </div>
                                <div className='text-[2.2vh] text-[#91A8ED] flex flex-row items-center justify-center font-semibold' >
                                    <button onClick={()=>{
                                        setAddStake(Math.round(IssuesList.tokenBalance)/2)
                                    }} className='mr-[2vh]' >50%</button>
                                    <button onClick={()=>{
                                        setAddStake(Math.round(IssuesList.tokenBalance))
                                    }} className=''>MAX</button>
                                </div>
                            </div>
                            <div className='w-full flex flex-row items-center justify-between mb-[2%]'>
                                <div className='text-[2vh] px-[7%] py-[1%] bg-[#272A36] rounded-[1.5vh]'>{IssuesList!==undefined && IssuesList.daoInfo.tokenSymbol}</div>
                                <input type="number" placeholder='0' className='w-[60%] p-[0.5vh] text-right bg-[#4B5563] focus-visible:outline-0' value={addStake} 
                                onChange={(e)=>setAddStake(parseInt(e.target.value))} />
                            </div>
                        </div>
                        <button className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-full py-[2.5%] rounded-b-[1vh] text-[2.7vh]' 
                        onClick={()=>{
                            if(addStake!==undefined){
                                if(addStake>0 && addStake<=IssuesList.tokenBalance){
                                    StakeOnIssueFunc()
                                }
                            }
                        }}
                        >
                            <div>Stake</div>
                        </button>
                    </div>
                </div>
                </>
                }
            </div>
            <LoadingScreen load={load} setLoad={setLoad} setPopupState={setPopupState} error={errorMsg} processName={processName} success={successMsg} redirectURL="" />
        </div>
    )
}

export default IssueAction;