import React from 'react'
import {useState,useEffect} from 'react'

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
            "DAO":daoInfo[0],
            "owner":daoInfo[1],
            "team":daoInfo[2],
            "metadata":daoInfo[3],
        }
        DaoInfoObj.metadata = await fetch(`https://gateway.ipfs.io/ipfs/${DaoInfoObj.metadata}`).then(res=>res.json())
        DaoInfoObj.metadata.tokenImg = `https://gateway.ipfs.io/ipfs/${DaoInfoObj.metadata.tokenImg}`

        // console.log(DaoInfoObj)
        setDaoInfo(DaoInfoObj)
    }

    useEffect(()=>{
        if(popupIssue===0){
            initDaoData()
            const popupStateStorage = localStorage.getItem('popupState')||'none'
            setPopupState(popupStateStorage)
        }
        if(popupIssue!==0){
            setPopupIssueID(popupIssue)
        }
    },[popupIssue])

    return (
        <div className='w-[98.5vw] h-[150vh] bg-[#303C4A] flex flex-row justify-start items-start overflow-x-hidden'>
            <DashboardMenu DaoInfo={DaoInfo} />
            <DaoDetailsBottom setPopupIssue={setPopupIssue} DaoInfo={DaoInfo} popupState={popupState}  setPopupState={setPopupState}/>

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