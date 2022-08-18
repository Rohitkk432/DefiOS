import React from 'react'

import {useSession, signIn, signOut} from 'next-auth/react'

interface GithubloginProps {

}

const Githublogin: React.FC<GithubloginProps> = ({}) => {

    const {data:session} = useSession()

    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center' >
            {!session && <button onClick={()=>signIn('github',{callbackUrl: `${window.location.origin}/creation/1`})} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Sign In</button>}
            {session && <button onClick={()=>signOut()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Sign Out</button>}
        </div>
    );
}

export default Githublogin;