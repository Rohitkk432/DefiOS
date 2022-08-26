import React from 'react'

import { XIcon } from '@heroicons/react/outline';

import Tags from '../utils/Tags'
import IssueState from '../utils/IssueState'

interface CreateIssueProps {

}

const CreateIssue: React.FC<CreateIssueProps> = ({}) => {
    return (
        <div className='w-full h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-20 
        flex items-center justify-center text-white' >
            <div className='w-[70vw] h-[75vh] bg-[#262B36] rounded-md 
            shadow-[0_4vh_4vh_5vh_rgba(0,0,0,0.3)] 
            flex flex-row items-center justify-between py-[1%] px-[1.5%]' >

                <div className='w-[66%] h-full flex flex-col justify-start items-start'>
                    <div className='flex flex-row items-center w-full flex-wrap text-[3.5vh] font-semibold' >
                        CLI flask run describes that uses --debug to enable debugger and reloader, but flask run does not have the -- debug option
                        <IssueState issueState='open' />
                    </div>
                    <div className='flex flex-row justify-between items-center w-full flex-wrap text-[2.5vh]' >
                        <div className='w-[45%] flex flex-row'>
                            <div className='' >Created by :</div> 
                            <div className=' ml-[2%] rounded-full text-gray-300 flex flex-row items-center' >
                                <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                                <div>/never2average</div>
                            </div>
                        </div>
                        <div className='w-[45%] flex flex-row'>
                            <div className=' ml-[2%]' >Created at :</div> 
                            <div className=' ml-[2%] rounded-full text-gray-300' >
                                5 days ago
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center w-full flex-wrap' >
                        <div className='text-[2.5vh]' >Tags :</div> 
                        <Tags tag='help wanted' />
                        <Tags tag='urgent' />
                    </div>
                    <div className='flex flex-row items-center w-full flex-wrap text-[2.5vh]' >
                        <div>Issue Url :</div> 
                        <a href="https://github.com/pallets/flask/issues/4777" target="_blank" className=' ml-[2%] rounded-full text-gray-300 flex flex-row items-center' >
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                            <div>/pallets/flask/issues/4777</div>
                        </a>
                    </div>

                    <div className='w-full h-full overflow-y-scroll border border-white 
                    p-[2.2%] mt-[4%] rounded-[2vh] customScrollbar text-[2.3vh]'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum laborum provident enim debitis. Commodi qui consequatur facilis aliquid porro debitis sit. Vero consequatur dignissimos harum nostrum alias quaerat aperiam commodi perferendis molestiae saepe eaque corrupti ipsa veniam officiis deserunt, debitis non nihil facilis sit dolore fugiat voluptatem vel natus maiores? Distinctio rerum, aperiam sint similique eos corporis nisi nam numquam sed voluptates tempore illo cumque, rem laboriosam odio facilis sequi alias itaque enim nobis blanditiis impedit. Eveniet architecto, dicta mollitia consectetur numquam culpa aliquam quas quasi, illo quae totam aperiam perspiciatis eius cum corrupti sequi consequatur sed repellat minima? Facilis?</div>

                </div>
                <div className='w-[32%] h-full flex flex-col justify-start items-end'>
                    <XIcon className='h-[4vh] mb-[4%]' />
                    <div className='w-full h-full bg-gray-600' ></div>
                </div>

            </div>
        </div>
    );
}

export default CreateIssue;