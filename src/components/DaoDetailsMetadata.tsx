import React from 'react'
import {useState} from 'react'
import {useSession} from 'next-auth/react'

import Tags from './utils/Tags'
import IssueState from './utils/IssueState'
import LoadingScreen from './utils/LoadingScreen'

// import {timeAgo} from '../utils/timeUtils'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faWallet,faSquarePollVertical,faTrophy,faMoneyBillTrendUp} from '@fortawesome/free-solid-svg-icons'


import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "./ContractFunctions/DaoABI.json"
// import TokenAbi from "./ContractFunctions/TokenABI.json"

interface DaoDetailsMetadataProps {
    metadata:any;
    DaoInfo:any;
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
    setPopupIssue: React.Dispatch<React.SetStateAction<number>>;
    setInlineTrigger: React.Dispatch<React.SetStateAction<number>>;
    first:boolean
}

const DaoDetailsMetadata: React.FC<DaoDetailsMetadataProps> = ({metadata,DaoInfo,setPopupState,setPopupIssue,setInlineTrigger,first}) => {

    const [load, setLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>()
    const [processName, setProcessName] = useState<string>()
    const [successMsg, setSuccessMsg] = useState<string>()
    
    const {data:session} = useSession()

    const compactNum = (num:number)=>{
        const formatter = Intl.NumberFormat('en',{notation:'compact'});
        return formatter.format(num);
    }

    const StartVotingFunc = async () => {
        if(metadata===undefined) return;
        if(Number(metadata.issueInfo.totalStaked)===0) return
        setLoad(true);
        setProcessName('Starting Voting Process')    
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        //start voting
        let txRes = false;
        const tx = await DaoContract.startVoting(metadata.contractIssueID)
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
            setSuccessMsg('Voting Started Successfully')
        }
    }

    const ChooseWinnerFunc = async () => {
        setLoad(true);
        setProcessName("Choosing Winner if Majority achieved");

        // web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        //get PR/collaboration info
        const collabInfo = []
        const CollabCount = await DaoContract.getCollaboratorCount(metadata.contractIssueID);
        for(let i=0;i<CollabCount;i++){
            const _info:any = {}
            const CollabInfo = await DaoContract.collaborators(metadata.contractIssueID,i);
            const _linkbreak = CollabInfo.url.split("/");
            const getPr = await fetch(`https://api.github.com/repos/${_linkbreak[3]}/${_linkbreak[4]}/pulls/${_linkbreak[6]}`).then(res => res.json());
            _info.collabID = i;
            _info.url = CollabInfo.url;
            _info.collaborator = CollabInfo.collaborator;
            _info.votes = CollabInfo.votes;
            _info.prDetails = getPr;
            collabInfo.push(_info)
        }

        let winnerChoosen = false;
        const tx = await DaoContract.chooseWinner(metadata.contractIssueID)
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
            const issueRes = await DaoContract.repoIssues(metadata.contractIssueID);
            // merge PR
            for(let i=0;i<collabInfo.length;i++){
                if(collabInfo[i].collaborator.toLowerCase()===issueRes.solver.toLowerCase()){
                    const _linkbreak = collabInfo[i].url.split("/");
                    await fetch(`https://api.github.com/repos/${_linkbreak[3]}/${_linkbreak[4]}/pulls/${_linkbreak[6]}/merge`,{
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${session?.accessToken}` },
                    }).catch(err=>console.log(err));
                }
            }
            // close issue
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${session?.accessToken}` },
                body: JSON.stringify({ state: "closed" })
            };
            const issueUrlToClose = metadata.issueInfo.issueURL.replace("github.com","api.github.com/repos")
            await fetch(issueUrlToClose,requestOptions)

            setSuccessMsg("Winner Choosen Successfully");
        }
    }

    return (
        <>
        <div className={`${first?'dao-details__step6':null} w-full min-h-[6vh] flex flex-row justify-start items-center bg-[#121418] rounded-md mb-[1%] pl-[1%] border border-[#5B5B5B] text-[1.7vh]`}
        onClick={()=>{
            if(metadata.issueInfo.state===0){
                setPopupIssue(Number(metadata.contractIssueID));
                setPopupState('issueAction')
            }else if(metadata.issueInfo.state===1){
                setPopupIssue(Number(metadata.contractIssueID));
                setPopupState('issueVote')
            }else if(metadata.issueInfo.state===2){
                setPopupIssue(Number(metadata.contractIssueID));
                setPopupState('issueReward')
            }
        }}>
            <div className='w-[33%] h-full mx-[0.5%]'>
                {metadata.githubInfo.title} <IssueState issueState={metadata.issueInfo.state} />
            </div>
            {/* <div className='w-[10%] h-full mx-[0.5%]'>{timeAgo(metadata.githubInfo.created_at)} ago</div> */}
            <div className='w-[35%] h-full mx-[0.5%] flex flex-row flex-wrap justify-start items-center'>
                {
                    metadata.githubInfo.labels.map((tag:any,idx:number)=>{
                        return <Tags tag={tag.name} key={idx} />
                    })
                }
            </div>
            <div className='w-[7%] h-full mx-[0.5%]'>{metadata.collabCount}</div>
            <div className='w-[15%] h-full mx-[0.5%] flex flex-row justify-between items-center'>
                <div className='w-[40%]'>{compactNum(parseInt(ethers.utils.formatEther(metadata.issueInfo.totalStaked)))} {DaoInfo.metadata.tokenSymbol} </div>
                {/* <div className='w-[40%]'>({metadata.amountStakedInUSD})</div> */}
            </div>
            
            {(DaoInfo.owner.toLowerCase()===localStorage.getItem("currentAccount")) &&
            metadata.issueInfo.state===0 &&
            <div className={`${first?'dao-details__step7':null} w-[10%] h-full cursor-pointer text-blue-500 font-semibold flex flex-row justify-start items-center z-20`}
            onClick={(e)=>{
                e.stopPropagation();
                StartVotingFunc()
            }}>
                <FontAwesomeIcon icon={faSquarePollVertical} className='inline h-[2vh] mr-[3%]'/>
                Start Voting
            </div>
            }
            {(DaoInfo.owner.toLowerCase()!==localStorage.getItem("currentAccount")) &&
            metadata.issueInfo.state===0 &&
            <div className={`${first?'dao-details__step7':null}  w-[10%] h-full cursor-pointer text-blue-500 font-semibold flex flex-row justify-start items-center z-20`}>
                <FontAwesomeIcon icon={faMoneyBillTrendUp} className='inline h-[2vh] mr-[3%]'/>
                Stake
            </div>
            }
            {(DaoInfo.owner.toLowerCase()===localStorage.getItem("currentAccount")) &&
            metadata.issueInfo.state===1 && 
            <div className={`${first?'dao-details__step7':null} w-[10%] h-full cursor-pointer text-orange-500 font-semibold flex flex-row justify-start items-center z-20`}
            onClick={(e)=>{
                e.stopPropagation();
                ChooseWinnerFunc()
            }}>
                <FontAwesomeIcon icon={faTrophy} className='inline h-[2vh] mr-[3%]'/>
                Choose Winner
            </div>
            }
            {(DaoInfo.owner.toLowerCase()!==localStorage.getItem("currentAccount")) &&
            metadata.issueInfo.state===1 &&
            <div className={`${first?'dao-details__step7':null} w-[10%] h-full cursor-pointer text-orange-500 font-semibold flex flex-row justify-start items-center z-20`}>
                <FontAwesomeIcon icon={faSquarePollVertical} className='inline h-[2vh] mr-[3%]'/>
                Vote on PR
            </div>
            }
            {(metadata.issueInfo.solver.toLowerCase()===localStorage.getItem("currentAccount")) &&
            metadata.issueInfo.state===2 &&
            <div className={`${first?'dao-details__step7':null} w-[10%] h-full cursor-pointer text-green-500 font-semibold flex flex-row justify-start items-center z-20`}>
                <FontAwesomeIcon icon={faWallet} className='inline h-[2vh] mr-[3%]'/>
                Claim Reward
            </div>
            }
            {(metadata.issueInfo.state===3  || ((metadata.issueInfo.solver.toLowerCase()!==localStorage.getItem("currentAccount")) && metadata.issueInfo.state===2))  && 
            <div className={`${first?'dao-details__step7':null} w-[10%] h-full cursor-pointer text-gray-400 font-semibold flex flex-row justify-start items-center z-20`}>-</div>
            }
        </div>
        <LoadingScreen load={load} setLoad={setLoad} setPopupState={setPopupState} error={errorMsg} processName={processName} success={successMsg} setSuccess={setErrorMsg} redirectURL="" setInlineTrigger={setInlineTrigger} />
        </>
    )
}

export default DaoDetailsMetadata;