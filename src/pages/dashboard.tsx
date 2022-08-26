import React from 'react'
import {useState, useEffect} from 'react'

import DashboardMenu from '../components/DashboardMenu';
import DashboardMain from '../components/DashboardMain';

import {ethers} from 'ethers'

interface DashboardProps {

}

declare let window:any

const Dashboard: React.FC<DashboardProps> = ({}) => {

    const [currentAccount, setCurrentAccount] = useState<string | undefined>()
    const [network, setNetwork] = useState<string | undefined>()

    useEffect(() => {
        if(!window.ethereum){
            return
        }
        let accountInStorage:any= localStorage.getItem("currentAccount")
        if(accountInStorage){
            setCurrentAccount(accountInStorage)
        }
        if(!currentAccount || !ethers.utils.isAddress(currentAccount) || !accountInStorage){
            onClickConnect();
        }
        window.ethereum.on('accountsChanged', () => {
            onClickConnect();
        });
        window.ethereum.on('chainChanged', () => {
            onClickConnect();
        });
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        
    },[currentAccount])

    const onClickConnect = () => {
        //client side code
        if(!window.ethereum) {
            console.log("please install MetaMask")
            return
        }

        //we can do it using ethers.js
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // MetaMask requires requesting permission to connect users accounts
        provider.send("eth_requestAccounts", [])
        .then((accounts)=>{
            if(accounts.length>0){
                setCurrentAccount(accounts[0])
                localStorage.setItem("currentAccount",accounts[0])
            }
        })
        .catch((e)=>console.log(e))

        provider.getNetwork().then(network => {
            console.log(network)
            setNetwork(network.name)
        }).catch(err => {
            console.log(err)
        })
    }

    // const onClickDisconnect = () => {
    //     console.log("onClickDisConnect")
    //     localStorage.removeItem("currentAccount")
    //     setCurrentAccount(undefined)
    // }

    return (
        <div className='w-screen h-screen bg-[#303C4A] flex flex-row justify-start items-start'>
            <DashboardMenu/>
            <DashboardMain currentAccount={currentAccount} network={network}/>
        </div>
    );
}

export default Dashboard;