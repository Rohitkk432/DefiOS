import React from 'react'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

import Tags from '../utils/Tags'
import { XIcon } from '@heroicons/react/outline'

interface NewIssueProps {
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
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

const NewIssue: React.FC<NewIssueProps> = ({setPopupState}) => {

    const [allTags , setAllTags] = useState<string[]>([])
    
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
                    
                    <input name='PRSearch' type="text" className='bg-[#262B36] w-full py-[1.5%] px-[2%] text-[2vh] text-white font-semibold rounded-md border-[#3A4E70] border' placeholder='Enter Issue Title' />                    
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
                    placeholder='Enter Issue Description'></textarea>

                    <div className='flex flex-row justify-center items-start w-full mt-[4%]'>
                        <button className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-[40%] py-[1.5%] rounded-[1vh] text-[2.7vh]'>Create Issue</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewIssue;