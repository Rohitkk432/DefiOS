import React from 'react'
import {useState,useEffect} from 'react'

import DashboardMenu from '../../components/DashboardMenu';
import DaoDetailsBottom from '../../components/DaoDetailsBottom';

import IssueAction from '../../components/IssuePopups/IssueAction'
import IssueVote from '../../components/IssuePopups/IssueVote'
import IssueReward from '../../components/IssuePopups/IssueReward'
import NewIssue from '../../components/IssuePopups/NewIssue'

interface DaoDetailsProps {

}

const DaoDetails: React.FC<DaoDetailsProps> = ({}) => {

    const [popupState, setPopupState] = useState<string>('none')

    useEffect(()=>{
        const popupStateStorage = localStorage.getItem('popupState')||'none'
        setPopupState(popupStateStorage)
    },[])

    return (
        <div className='w-[98.5vw] h-[150vh] bg-[#303C4A] flex flex-row justify-start items-start overflow-x-hidden'>
            <DashboardMenu/>
            <DaoDetailsBottom setPopupState={setPopupState}/>

            {
            (popupState === 'issueAction')?
                <IssueAction setPopupState={setPopupState}/>:
            (popupState === 'issueVote')?
                <IssueVote setPopupState={setPopupState}/>:
            (popupState === 'issueReward')?
                <IssueReward setPopupState={setPopupState}/>:
            (popupState === 'newIssue')?
                <NewIssue setPopupState={setPopupState}/>:null
            }
        </div>
    );
}

export default DaoDetails;