import React from 'react'

interface WhitepaperProps {

}

const Whitepaper: React.FC<WhitepaperProps> = ({}) => {
    return (
        <iframe className='w-screen h-screen' src='/assets/pdfs/DefiOS_Whitepaper.pdf' />
    );
}

export default Whitepaper;