import React from 'react'
import {useState,useEffect,useMemo} from 'react'
import {useSession} from 'next-auth/react'
import LoadingScreen from '../utils/LoadingScreen';

import { XIcon,SearchIcon } from '@heroicons/react/outline';

import Tags from '../utils/Tags'
import IssueState from '../utils/IssueState'
import BoxPR from './BoxPR'

import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "../ContractFunctions/DaoABI.json"

import {timeAgo} from '../../utils/timeUtils'

interface IssueVoteProps {
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
    DaoInfo: any;
    popupIssueID: number;
}

const IssueVote: React.FC<IssueVoteProps> = ({setPopupState,DaoInfo,popupIssueID}) => {
    const {data:session} = useSession()

    const [load, setLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>()
    const [processName, setProcessName] = useState<string>()
    const [successMsg, setSuccessMsg] = useState<string>()

    // const {data:session} = useSession()

    const [IssuesList,setIssuesList] = useState<any>()
    const [PRChoosen,setPRChoosen] = useState(NaN);

    const getTheIssue = async () => {
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);
        const issueRes = await DaoContract.repoIssues(popupIssueID);

        //getting stakers
        const stakersRes = [];
        const stakersObj:any = {}
        let _calcTotalStaked = 0;
        let _doCalc = true;
        let _calcIndex = 0;
        while(_doCalc){
            const stakersOne = await DaoContract.stakers(popupIssueID,_calcIndex);
            _calcTotalStaked += Number(stakersOne.amount);
            stakersRes.push(stakersOne.staker.toLowerCase());
            const _stakeObj = {
                amount : Number(stakersOne.amount),
                staker : stakersOne.staker.toLowerCase(),
                voted : stakersOne.voted,
                stakerID : _calcIndex
            }
            stakersObj[stakersOne.staker.toLowerCase()] = _stakeObj;
            if(_calcTotalStaked === Number(issueRes.totalStaked)){
                _doCalc=false
            }
            _calcIndex++;
        }
        
        //get PR/collaboration info
        const collabInfo = []
        const CollabCount = await DaoContract.getCollaboratorCount(popupIssueID);
        for(let i=0;i<CollabCount;i++){
            const _info:any = {}
            const CollabInfo = await DaoContract.collaborators(popupIssueID,i);
            const _linkbreak = CollabInfo.url.split("/");
            const getPr = await fetch(`https://api.github.com/repos/${_linkbreak[3]}/${_linkbreak[4]}/pulls/${_linkbreak[6]}`,{
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${session?.accessToken}` },
                    }).then(res => res.json());
            _info.collabID = i;
            _info.url = CollabInfo.url;
            _info.collaborator = CollabInfo.collaborator;
            _info.votes = CollabInfo.votes;
            _info.prDetails = getPr;
            collabInfo.push(_info)
        }

        const apiURL = issueRes.issueURL.replace('github.com','api.github.com/repos');
        const githubRes = await fetch(apiURL,{
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${session?.accessToken}` },
                    }).then(res=>res.json()).catch(err=>console.log(err));
        const IterIssue = {
            issueInfo: issueRes,
            githubInfo: githubRes,
            stakersAddress: stakersRes,
            stakersObj: stakersObj,
            collabInfo: collabInfo,
        }
        // console.log(IterIssue)
        setIssuesList(IterIssue);
    }

    const voteForPR = async () =>{
        if(PRChoosen === NaN) return;
        if(localStorage.getItem('currentAccount')===null || localStorage.getItem('currentAccount')===undefined) return;
        setLoad(true);
        setProcessName("Voting for PR");
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        let txRes = false;
        const tx = await DaoContract.voteOnIssue(popupIssueID,PRChoosen,IssuesList.stakersObj[`${localStorage.getItem('currentAccount')?.toLowerCase()}`].stakerID)
        .then((res:any)=>{
            txRes=true;
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
            setSuccessMsg("Voted Successfully");
        }
    }

    // const ChooseWinnerFunc = async () => {
    //     setLoad(true);
    //     setProcessName("Choosing Winner if Majority achieved");
    //     // web3
    //     let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
    //     let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
    //     let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

    //     let winnerChoosen = false;
    //     const tx = await DaoContract.chooseWinner(popupIssueID)
    //     .then((res:any)=>{
    //         winnerChoosen = true;
    //         return res
    //     })
    //     .catch((err:any)=>{
    //         if(err.error===undefined){
    //             setErrorMsg('Transaction Rejected')
    //         }else{
    //             setErrorMsg(err.error.data.message)
    //         }
    //     });

    //     if(winnerChoosen){
    //         await tx.wait();
    //         const issueRes = await DaoContract.repoIssues(popupIssueID);
    //         //merge PR
    //         for(let i=0;i<IssuesList.collabInfo.length;i++){
    //             if(IssuesList.collabInfo[i].collaborator.toLowerCase()===issueRes.solver.toLowerCase()){
    //                 const _linkbreak = IssuesList.collabInfo[i].url.split("/");
    //                 await fetch(`https://api.github.com/repos/${_linkbreak[3]}/${_linkbreak[4]}/pulls/${_linkbreak[6]}/merge`,{
    //                     method: 'PUT',
    //                     headers: { 'Authorization': `Bearer ${session?.accessToken}` },
    //                 }).catch(err=>console.log(err));
    //             }
    //         }
    //         //close issue
    //         const requestOptions = {
    //             method: 'PATCH',
    //             headers: { 'Authorization': `Bearer ${session?.accessToken}` },
    //             body: JSON.stringify({ state: "closed" })
    //         };
    //         const issueUrlToClose = IssuesList.issueInfo.issueURL.replace("github.com","api.github.com/repos")
    //         await fetch(issueUrlToClose,requestOptions)

    //         setSuccessMsg("Winner Choosen Successfully");
    //     }
    // }

    //search logic
    const [search, setSearch] = useState("");

    const PrSearch = useMemo(() => {
        if (IssuesList===undefined) return;
        if (search==="") return IssuesList.collabInfo;
        return IssuesList.collabInfo.filter((_pr:any) => {
            return (
                _pr.prDetails.user.login.toLowerCase().includes(search.toLowerCase()) ||
                _pr.prDetails.number.toLowerCase().includes(search.toLowerCase()) ||
                _pr.prDetails.title.toLowerCase().includes(search.toLowerCase()) || 
                _pr.collabID === PRChoosen
            );
        });
    }, [search,IssuesList]);

    useEffect(()=>{
        if(DaoInfo!==undefined && popupIssueID!==0){
            getTheIssue();
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
                        <IssueState issueState='voting' />
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
                        <a href={IssuesList!==undefined ? IssuesList.issueInfo.issueURL:''} target="_blank" className='ml-[2%] text-gray-300 flex flex-row items-center w-[80%]' >
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

                    {/* {DaoInfo!==undefined && IssuesList!==undefined && localStorage.getItem('currentAccount')!==null && DaoInfo.owner.toLowerCase()===localStorage.getItem('currentAccount')?.toLocaleLowerCase() &&
                    <div className='flex flex-row justify-start items-start w-full mt-[2%]'>
                        <button className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-[30%] py-[1%] rounded-[1vh] text-[2.7vh]' onClick={ChooseWinnerFunc}
                        >Choose Winner</button>
                    </div>
                    } */}

                </div>
                <div className='w-[32%] h-full flex flex-col justify-start items-end'>
                    <XIcon className='h-[4vh] mb-[4%]'
                    onClick={()=>{
                        setPopupState('none')
                        localStorage.removeItem('popupState')
                    }} />
                    <div className='w-full h-[91%] bg-gray-600 py-[4%] px-[3%] relative 
                    flex flex-col items-center justify-start rounded-[1vh]' >
                        <input name='PRSearch' type="text" className='bg-[#121418] w-full py-[2.5%] px-[4%] text-[1.7vh] font-semibold rounded-md border-[#3A4E70] border mb-[3%] ' placeholder='Search for PR by #, author, title and plagiarism' value={search}onChange={(e) => setSearch(e.target.value)} />
                        <SearchIcon className='w-[5%] absolute top-[5%] right-[5%]' />
                        <div className='h-[75%] mb-[5%] w-full overflow-y-scroll customScrollbar'>
                            {
                                IssuesList!==undefined && PrSearch.map((collab:any,idx:number)=>{
                                    return <BoxPR PRChoosen={PRChoosen} setPRChoosen={setPRChoosen} PrData={collab} key={idx} />
                                })
                            }
                        </div>
                        {
                            IssuesList!==undefined && localStorage.getItem('currentAccount')!==null && IssuesList.stakersAddress.includes(localStorage.getItem('currentAccount')?.toLowerCase()) && !IssuesList.stakersObj[`${localStorage.getItem('currentAccount')?.toLowerCase()}`].voted &&
                            <button onClick={voteForPR} className='flex flex-row justify-center items-center bg-[#91A8ED] 
                            w-full py-[2.5%] rounded-[1vh] text-[2.7vh]'>Submit Vote</button>
                        }
                    </div>
                </div>
                </>
                }
            </div>
            <LoadingScreen load={load} setLoad={setLoad} setPopupState={setPopupState} error={errorMsg} processName={processName} success={successMsg} redirectURL="" />
        </div>
    );
}

export default IssueVote;