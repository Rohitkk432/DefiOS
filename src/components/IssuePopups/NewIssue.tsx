import React from 'react'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import LoadingScreen from '../utils/LoadingScreen';

import Tags from '../utils/Tags'
import { XIcon } from '@heroicons/react/outline'

import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "../ContractFunctions/DaoABI.json"
import TokenAbi from "../ContractFunctions/TokenABI.json"

interface NewIssueProps {
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
    DaoInfo: any;
}

interface CreateTagProps {
    allTags: string[];
    setAllTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const CreateTag: React.FC<CreateTagProps> = ({allTags,setAllTags}) => {
    const tagsList = ['bug','documentation','duplicate','enhancement','good first issue','help wanted','invalid','question','urgent']
    const [selectedTag, setSelectedTag] = useState(tagsList[0])
    return (
        <div className="relative w-[23vh]">
            <Listbox value={selectedTag} onChange={setSelectedTag}>
                <div className="relative">
                    <Listbox.Button className="relative w-full text-center bg-gray-800 
                    text-gray-300 border border-gray-300 rounded-full text-[2.3vh] py-[0.5vh]">
                        +Add Issue Label
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute mt-[0.5vh] h-[52vh] w-full overflow-y-scroll customScrollbar rounded-[1.5vh] bg-gray-900">
                            {tagsList.map((tag,idx) => (
                                <Listbox.Option
                                    key={idx}
                                    value={tag}
                                    disabled={allTags.includes(tag)}
                                    className={`w-[90%] h-[9%] ml-[6%] my-[1vh] ${allTags.includes(tag) ? "hidden" : null }`}
                                    onClick={()=>{
                                        setAllTags([...allTags,tag])
                                    }}
                                >
                                    <Tags tag={tag} />
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}

const NewIssue: React.FC<NewIssueProps> = ({setPopupState,DaoInfo}) => {

    const [load, setLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>()
    const [successMsg, setSuccessMsg] = useState<string>()

    const [allTags , setAllTags] = useState<string[]>([])

    const [issueTitle, setIssueTitle] = useState('')
    const [issueBody, setIssueBody] = useState('')

    const createNewIssue = async () => {
        setLoad(true)

        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        const DaoTokenAddress = await DaoContract.TOKEN();
        let TokenContract : ethers.Contract = new ethers.Contract(DaoTokenAddress, TokenAbi , signer);
        const userTokenBalance = ethers.utils.formatEther(await TokenContract.balanceOf(await signer.getAddress()));

        if(parseInt(userTokenBalance) < 1){
            setErrorMsg("You need to be Token Holder to create an Issue")
            return
        }


        const user = await fetch(`https://api.github.com/user/${DaoInfo.metadata.partners[0]}`).then(res=>res.json()).catch(err=>console.log(err))

        const response = await fetch('/api/issue/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: issueTitle,
                body: issueBody,
                labels: allTags,
                owner: user.login,
                repo: DaoInfo.metadata.repoName
            })
        })
        const issueOutput = await response.json()

        let txRes = false;
        const tx = await DaoContract.createIssue(issueOutput.data.html_url,0)
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
            setSuccessMsg("Issue Created Successfully")
        }
    }
    
    return (
        <div className='w-full h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-20 
        flex items-center justify-center text-white' >
            <div className='w-[45vw] h-[80vh] bg-[#262B36] rounded-md 
            shadow-[0_4vh_4vh_5vh_rgba(0,0,0,0.3)] 
            flex flex-row items-center justify-between py-[1%] px-[1.5%]' >

                <div className='w-[100%] h-full flex flex-col justify-start items-start'>
                    <div className='w-full flex flex-col items-end'>
                        <XIcon className='h-[4vh] mb-[2%]'
                        onClick={()=>{
                            setPopupState('none')
                        }}/>
                    </div>
                    
                    <input name='PRSearch' type="text" className='bg-[#262B36] w-full py-[1.5%] px-[2%] text-[2vh] text-white font-semibold rounded-md border-[#3A4E70] border' placeholder='Enter Issue Title' value={issueTitle} onChange={(e)=>setIssueTitle(e.target.value)}/>                    
                    <div className='flex flex-row items-center w-full flex-wrap mt-[2%]' >
                        <div className='text-[2.5vh] mr-[1%]' >Issue Label :</div> 
                        {
                            allTags.map((tag,idx) => {
                                return <Tags key={idx} tag={tag} assign={true} setAllTags={setAllTags} allTags={allTags} />
                            })
                        }
                        <CreateTag setAllTags={setAllTags} allTags={allTags} />
                    </div>

                    <textarea className='w-full h-full overflow-y-scroll border border-white 
                    p-[2.2%] mt-[4%] rounded-[2vh] customScrollbar text-[2.3vh] bg-[#262B36] resize-none'
                    placeholder='Enter Issue Description' value={issueBody} onChange={(e)=>setIssueBody(e.target.value)} ></textarea>

                    <div className='flex flex-row justify-center items-start w-full mt-[4%]'>
                        <button onClick={createNewIssue} className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-[40%] py-[1.5%] rounded-[1vh] text-[2.7vh]'>Create Issue</button>
                    </div>
                </div>
            </div>
            <LoadingScreen load={load} setLoad={setLoad} setPopupState={setPopupState} error={errorMsg} redirectURL='' success={successMsg} processName="Creating Issue" />
        </div>
    );
}

export default NewIssue;