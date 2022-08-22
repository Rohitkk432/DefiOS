import React from 'react'
import { useState,useEffect } from 'react'

import {PencilIcon,XIcon} from '@heroicons/react/outline'

interface UserOptionsProps {
    contributor:any;
    triggerToMain:number;
    setTriggerToMain:React.Dispatch<React.SetStateAction<number>>;
}

const UserOptions: React.FC<UserOptionsProps> = ({contributor,triggerToMain,setTriggerToMain}) => {

    const fontsizer2 = 'text-[calc(98vh/60)]';

    const [isEditing,setIsEditing] = useState(false);
    const [share,setShare] = useState('0%');

    const [newValue,setNewValue] = useState('');

    useEffect(()=>{
        const data = JSON.parse(localStorage.getItem('DaoCreationData')||'{}');
        setShare(data.distribution[`${contributor.author.login}`]);
    },[triggerToMain])

    const handleEditSumbit = ()=>{
        if(newValue==="") return
        const data = JSON.parse(localStorage.getItem('DaoCreationData')||'{}');
        if(newValue[newValue.length-1]!=='%'){
            data.distribution[`${contributor.author.login}`] = newValue + '%'
        }else{
            data.distribution[`${contributor.author.login}`] = newValue
        }
        localStorage.setItem('DaoCreationData',JSON.stringify(data))
        if(triggerToMain>=1){
            setTriggerToMain(triggerToMain+1);
        }else{
            setTriggerToMain(2);
        }
        setIsEditing(false);
        setNewValue('');
    }

    return (
        <>
        {(!isEditing)?
        (
            // Assigned 
            <div className='bg-[#121418] w-full h-[20%] px-[2%] py-[2%] mt-[2%] text-xs font-semibold rounded-md border-[#2E2E2F] border flex flex-row align-center justify-between' >
                {/* user name */}
                <div className='flex flex-row'>
                    <img src={contributor.author.avatar_url} className='w-[2.5vh] h-[2.5vh] mr-[1vh] rounded-full'/>
                    <div className={`text-[#D7D7D7] ${fontsizer2}`}>{contributor.author.login}</div>
                </div>
                {/* user distribution */}
                <div className={`px-[1%] ${fontsizer2} text-[#B5C3DB]
                flex flex-row align-center justify-center`} >
                    <div>{share}</div> 
                    <PencilIcon onClick={()=>setIsEditing(true)} className='w-[3vh] mx-[5%]  text-[#B5C3DB]'/>
                </div>
            </div>
        ):
        (
            // Unassigned 
            <div className='bg-[#121418] w-full h-[40%] px-[2%] py-[2%] mt-[2%] text-xs font-semibold rounded-md border-[#2E2E2F] border flex flex-col align-start justify-start' >
                <div className='flex flex-row align-center justify-between w-full mb-[3%]'>
                    {/* user name */}
                    <div className='flex flex-row'>
                        <img src={contributor.author.avatar_url} className='w-[2.5vh] h-[2.5vh] mr-[1vh] rounded-full'/>
                        <div className={`text-[#D7D7D7] ${fontsizer2}`}>{contributor.author.login}</div>
                    </div>
                    {/* user distribution */}
                    <div className={`px-[1%] ${fontsizer2} text-[#B5C3DB]
                    flex flex-row align-center justify-center`} >
                        <div>{share}</div>
                        <XIcon onClick={()=>setIsEditing(false)} className='w-[3vh] mx-[5%] text-[#B5C3DB]'/>
                    </div>
                </div>
                <div className='flex flex-row align-center justify-between w-full'>
                    <input type="text" name='newPercentage' className={`bg-[#121418] w-full py-[1%] px-[4%] ${fontsizer2} font-semibold rounded-l-md border-[#3A4E70] border border-r-0`} placeholder='Enter New %' value={newValue} onChange={(e)=>setNewValue(e.target.value)} />
                    {/* user distribution */}
                    <button onClick={handleEditSumbit} className={`${fontsizer2} px-[5%] rounded-sm bg-[#91A8ED]`} >Update</button>
                </div>
            </div>
        )}
        </>
    );
}

export default UserOptions;