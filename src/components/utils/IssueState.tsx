import React from 'react'

interface IssueStateProps {
    issueState:string
}

const IssueState: React.FC<IssueStateProps> = ({issueState})=>{
    return (
        <>
            {
                (issueState==="open")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.8vh] inline border border-blue-400 bg-blue-900 text-blue-400 font-bold' >Open</div>:
                (issueState==="closed")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.8vh] inline border border-green-500 bg-green-900 text-green-400 font-bold' >Closed</div>:
                (issueState==="voting")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.8vh] inline border border-orange-500 bg-orange-900 text-orange-400 font-bold' >Voting</div>:null
            }
        </>
    )
}

export default IssueState;