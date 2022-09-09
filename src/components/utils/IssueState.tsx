import React from 'react'

interface IssueStateProps {
    issueState:string|number
}

const IssueState: React.FC<IssueStateProps> = ({issueState})=>{
    return (
        <>
            {
                (issueState==="open"||issueState===0)?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.8vh] inline border border-blue-400 bg-blue-900 text-blue-400 font-bold' >Open</div>:
                (issueState==="voting"||issueState===1)?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.8vh] inline border border-orange-500 bg-orange-900 text-orange-400 font-bold' >Voting</div>:
                (issueState==="winner chosen"||issueState===2)?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.8vh] inline border border-green-500 bg-green-900 text-green-400 font-bold' >Winner Chosen</div>:
                (issueState==="closed"||issueState===3)?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.8vh] inline border border-red-500 bg-red-900 text-red-400 font-bold' >Closed</div>:null
            }
        </>
    )
}

export default IssueState;