import React from 'react'
import DashboardMenu from '../../components/DashboardMenu';
import DaoDetailsBottom from '../../components/DaoDetailsBottom';

import CreateIssue from '../../components/IssuePopups/CreateIssue'

interface DaoDetailsProps {

}

const DaoDetails: React.FC<DaoDetailsProps> = ({}) => {
    return (
        <div className='w-[98.5vw] h-[150vh] bg-[#303C4A] flex flex-row justify-start items-start overflow-x-hidden'>
            <DashboardMenu/>
            <DaoDetailsBottom/>

            <CreateIssue/>
        </div>
    );
}

export default DaoDetails;