import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSquareArrowUpRight} from '@fortawesome/free-solid-svg-icons'

interface HomepageProps {

}

const Homepage: React.FC<HomepageProps> = ({}) => {
    return (
        <div className='w-screen h-screen homepageGradient px-[6%] py-[2%] text-white flex flex-col justify-start items-center'>
            
            {/* backdrop globe */}
            <div className='h-full w-[88%] absolute top-[0%] overflow-hidden z-10'>
                <img src="/assets/images/backdrop.png" className='h-full m-auto' />
            </div>

            {/* navbar */}
            <div className='w-full flex flex-row justify-between items-center h-[7vh] z-20'>
                <img src="/assets/images/defi-os-logo.png" className='h-full' />
                <div className='flex flex-row justify-end items-center w-full h-full' >
                    <div className='mx-[2%] font-thin text-[2.5vh]'>Whiteboard Explainer</div>
                    <div className='mx-[2%] font-thin text-[2.5vh]'>Whitepaper</div>
                    <div className='mx-[2%] font-thin text-[2.5vh] flex flex-row justify-center items-center'>
                        <div>Contact Us</div>
                        <img src="/assets/images/UpRightArrow.svg"  className='inline h-[3vh]'/>
                    </div>
                </div>
            </div>

            <div className='h-full w-full flex justify-center items-center z-20'>
                <div className=''>
                    <div className="flex flex-row justify-center items-center leading-[12vh] text-[10vh] font-semibold workSansFont">
                        <div className='mx-[1%] gradientText1' >Making</div>
                        <div className='mx-[1%]' >Open</div>
                        <div className='mx-[1%]' >Source</div>
                    </div>
                    <div className="flex flex-row justify-center items-center leading-[12vh] text-[10vh] font-semibold workSansFont">
                        <div className='mx-[1%] gradientText1' >Sustainable for all</div>
                    </div>
                    <div className='flex flex-col justify-center items-center text-[2.3vh] w-[100%] m-auto my-[8%]'>
                        <div className='flex flex-row justify-center items-center w-full mb-[1%]'>
                            <div>DefiOS converts open source repositories into DAOs with</div>
                            <div className='ml-[1%] text-[#437FEC]'>project native</div>
                        </div>
                        <div className='flex flex-row justify-center items-center w-full'>
                            <div className='text-[#437FEC]'>tokens</div>
                            <div className='mx-[1%]' >that enterprise users can use to</div>
                            <div className='text-[#437FEC]'>incentivize developers.</div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center items-center w-full text-[#1D242D] text-[2vh] font-semibold'>
                        <button className='bg-[#D1D2D2] py-[2.5%] w-[27%] rounded-[0.75vh] mx-[2%] flex flex-row justify-center items-center' >
                            <img src="/assets/images/UpRightArrow2.svg"  className='inline h-[3vh]'/>
                            <div>Get Started</div>
                        </button>
                        <button className='bg-[#7082C3] py-[2.5%] w-[27%] rounded-[0.75vh] mx-[2%] flex flex-row justify-center items-center' >
                            <img src="/assets/images/UpRightArrow2.svg"  className='inline h-[3vh]'/>
                            <div>Latest Updates</div>
                        </button>
                    </div>
                </div>
            </div>



        </div>
    );
}

export default Homepage;