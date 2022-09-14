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

    const [load, setLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>()

    const {data:session} = useSession()

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
            const getPr = await fetch(`https://api.github.com/repos/${_linkbreak[3]}/${_linkbreak[4]}/pulls/${_linkbreak[6]}`).then(res => res.json());
            _info.collabID = i;
            _info.url = CollabInfo.url;
            _info.collaborator = CollabInfo.collaborator;
            _info.votes = CollabInfo.votes;
            _info.prDetails = getPr;
            collabInfo.push(_info)
        }

        const apiURL = issueRes.issueURL.replace('github.com','api.github.com/repos');
        const githubRes = await fetch(apiURL).then(res=>res.json()).catch(err=>console.log(err));
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
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        let txRes = false;
        const tx = await DaoContract.voteOnIssue(popupIssueID,PRChoosen,IssuesList.stakersObj[`${localStorage.getItem('currentAccount')?.toLowerCase()}`].stakerID)
        .then((res:any)=>{
            setLoad(false);
            setPopupState('none')
            localStorage.removeItem('popupState')
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
        }
    }

    const ChooseWinnerFunc = async () => {
        setLoad(true);
        // web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        let winnerChoosen = false;
        const tx = await DaoContract.chooseWinner(popupIssueID)
        .then((res:any)=>{
            winnerChoosen = true;
            return res
        })
        .catch((err:any)=>{
            if(err.error===undefined){
                setErrorMsg('Transaction Rejected')
            }else{
                setErrorMsg(err.error.data.message)
            }
        });

        if(winnerChoosen){
            await tx.wait();
            const issueRes = await DaoContract.repoIssues(popupIssueID);
            //merge PR
            for(let i=0;i<IssuesList.collabInfo.length;i++){
                if(IssuesList.collabInfo[i].collaborator.toLowerCase()===issueRes.solver.toLowerCase()){
                    const _linkbreak = IssuesList.collabInfo[i].url.split("/");
                    await fetch(`https://api.github.com/repos/${_linkbreak[3]}/${_linkbreak[4]}/pulls/${_linkbreak[6]}/merge`,{
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${session?.accessToken}` },
                    }).catch(err=>console.log(err));
                }
            }
            //close issue
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${session?.accessToken}` },
                body: JSON.stringify({ state: "closed" })
            };
            const issueUrlToClose = IssuesList.issueInfo.issueURL.replace("github.com","api.github.com/repos")
            await fetch(issueUrlToClose,requestOptions)

            setLoad(false);
            setPopupState('none')
            localStorage.removeItem('popupState')
        }
    }

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
                            <div>{IssuesList!==undefined && IssuesList.issueInfo.issueURL.replace("https://github.com","")}</div>
                        </a>
                    </div>

                    <div className='w-full h-full overflow-y-scroll border border-white 
                    p-[2.2%] mt-[4%] rounded-[2vh] customScrollbar text-[2.3vh]'>
                        {IssuesList!==undefined && IssuesList.githubInfo.body}
                    </div>

                    {DaoInfo!==undefined && IssuesList!==undefined && localStorage.getItem('currentAccount')!==null && DaoInfo.owner.toLowerCase()===localStorage.getItem('currentAccount')?.toLocaleLowerCase() &&
                    <div className='flex flex-row justify-start items-start w-full mt-[2%]'>
                        <button className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-[30%] py-[1%] rounded-[1vh] text-[2.7vh]' onClick={ChooseWinnerFunc}
                        >Choose Winner</button>
                    </div>
                    }

                </div>
                <div className='w-[32%] h-full flex flex-col justify-start items-end'>
                    <XIcon className='h-[4vh] mb-[4%]'
                    onClick={()=>{
                        setPopupState('none')
                        localStorage.removeItem('popupState')
                    }} />
                    <div className='w-full h-[91%] bg-gray-600 py-[4%] px-[3%] relative 
                    flex flex-col items-center justify-start rounded-[1vh]' >
                        <input name='PRSearch' type="text" className='bg-[#121418] w-full py-[2.5%] px-[4%] text-[1.7vh] font-semibold rounded-md border-[#3A4E70] border mb-[3%] ' placeholder='Search for PR by Author, tag or commit hash' value={search}onChange={(e) => setSearch(e.target.value)} />
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
            </div>
            <LoadingScreen load={load} setLoad={setLoad} setPopupState={setPopupState} error={errorMsg} />
        </div>
    );
}

export default IssueVote;