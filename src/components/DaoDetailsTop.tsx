import React from 'react'

interface DaoDetailsTopProps {

}

const DaoDetailsTop: React.FC<DaoDetailsTopProps> = ({}) => {
    return (
        <div className='w-full h-[48%] flex flex-row justify-between items-center'>
            <div className='w-[30%] h-full rounded-md bg-[#191C21] flex flex-col justify-start items-start p-[1.5%]'>
                <div className='text-[3vh] font-semibold mb-[2%]' >Ape Hackers Pro X</div>
                <div className='w-full flex flex-row justify-between items-center' >
                    <img src="https://res.cloudinary.com/rohitkk432/image/upload/v1660833498/defios_logo_gsg4eo.png" alt="" className='h-[13vh] w-[13vh] rounded-full' />
                    <div className='flex flex-col items-start justify-start w-[64%] text-[2.2vh]' >
                        <div className='mb-[2.5%] '>ape-hackers</div>
                        <div className='mb-[2.5%] '>never2average</div>
                        <div className='mb-[2.5%] '>Repository name</div>
                        <div className='mb-[2.5%] '>Repository name</div>
                    </div>
                </div>
                <div className='text-[2.5vh] my-[2%]' >Token Stats</div>
                <div className='text-[2.5vh] font-bold flex flex-row justify-start items-center w-full border-white border rounded-md py-[2.5%] my-[1.5%]' >
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/ape.svg" alt="" className='w-[4.3vh] h-[4.3vh] mx-[10%]' />
                    <div className='w-[30%] ml-[10%]' >Apes</div>
                    <div className='w-[30%]'>APE</div>
                </div>
                <div className='text-[2.5vh] font-bold flex flex-row justify-evenly items-center w-full border-white border rounded-md py-[2%] my-[1.5%]' >
                    <div>1 APE</div>
                    <div>=</div>
                    <div>0.005 USDC</div>
                </div>

                <div className='text-[2.8vh] mt-[3%] mb-[2%] w-full text-center font-bold '>
                    Top 3 Holders
                </div>
                <div className='w-full flex flex-row justify-between items-center text-[2.2vh] mb-[2.5%]' >
                    <div>never2average</div>
                    <div>270 APE</div>
                </div>
                <div className='w-full flex flex-row justify-between items-center text-[2.2vh] mb-[2.5%]' >
                    <div>rohitkk432</div>
                    <div>190 APE</div>
                </div>
                <div className='w-full flex flex-row justify-between items-center text-[2.2vh] mb-[2.5%]' >
                    <div>AbhisekBasu1</div>
                    <div>65 APE</div>
                </div>
            </div>
            <div className='w-[69%] h-full rounded-md bg-[#191C21]'>
            </div>
        </div>
    );
}

export default DaoDetailsTop;