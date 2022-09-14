import React from 'react'

interface BoxPRProps {
    PrData : any;
    setPRChoosen: React.Dispatch<React.SetStateAction<number>>;
    PRChoosen: number;
}

const BoxPR: React.FC<BoxPRProps> = ({PrData,setPRChoosen}) => {
    return (
        <div className='w-full h-[10vh] bg-[#121418] mb-[1.5vh] rounded-[1vh]
        px-[3%] py-[2%] flex flex-col items-start justify-between relative'>
            <a href={PrData.url} className='text-[2vh]' >
                {PrData.prDetails.title.length>40?`${PrData.prDetails.title.slice(0,40)}...`:PrData.prDetails.title}
            </a>
            <div className='text-[1.8vh] w-full flex flex-row items-center justify-between' >
                <div className='flex flex-row w-[90%] items-center'>
                    <div className=''>Author :</div>
                    <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2vh] ml-[3%]' />
                    <div>/{PrData.prDetails.user.login}</div>
                </div>
                {/* checkbox */}
                <div className="w-[2.5vh] h-[2.5vh] absolute bottom-[10%] right-[2%]">
                    <input type="radio" name="VotePR" className='peer absolute opacity-0 w-full h-full cursor-pointer' value={PrData.collabID} onChange={(e)=>{
                    if(e.target.checked){
                        setPRChoosen(parseInt(e.target.value));
                    }
                    }}/>
                    <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                    flex justify-center items-center
                    peer-checked:after:block
                    after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                </div>
            </div>
        </div>
    );
}

export default BoxPR;