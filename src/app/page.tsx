"use client"
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { JsonRpcApiProvider } from 'ethers';
import { JsonRpcProvider ,  } from 'ethers';
import Ethereum from '../assets/Eth.png'
import Profile from '../assets/Nft.png'
import Web3Modal from "web3modal";
export default function Home() {
  const [account, setAccount] = useState("");
  const [balance , setBalance] = useState("");
  const [connect , setConnect] = useState(false);
  const failMessage = "Failed to Connect with Your Metamask account. Please Check and retry again"
  const provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/b27ad50709544a07a600c08e4a7ffe95`);
  const checkIfWalletConnected = async () =>{
    if(!window.ethereum) return;
    const accounts = await window.ethereum.request({method : "eth_accounts"});
    console.log(accounts);
    if(accounts.length){
      setAccount(accounts[0]); 
    }
    else{
      // return failMessage;
      console.log("Fail");
    }
    const address = "0xF02c1c8e6114b1Dbe8937a39260b5b0a374432bB"
    const balance = await provider.getBalance(address);
    const showBalance = `${ethers.formatEther(balance)}-ETH`
    console.log(showBalance);
    setBalance(showBalance);
    
  }
  const connectWallet = async ()=>{
   if(!window.ethereum) return console.log(failMessage);
   const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
   setAccount(accounts[0]);
   window.location.reload();
  }
  useEffect(()=>{
    checkIfWalletConnected();
  })
  useEffect(()=>{
    async function accountChanged(){
      window.ethereum.on("accountsChanged" , async function(){
        const accounts = await window.ethereum.request(
          {
            method: "eth_accounts"
          }
        );
        if(accounts.length){
          setAccount(accounts[0]);
        }else{
          window.location.reload();
        }
      })
    }
    accountChanged()
  },[])
  return (
  <div className="card">
    {!account ? "" : <span className='master'>PRO</span>}
    <Image src ={Profile} alt={"Profile Image Alt Text"} width={90} height={90}/>
    <h3> Check Ether</h3>
     {!account ? (
      <div>
        <div className="message">
          <p>{failMessage}</p>
        </div>
        <Image src ={Ethereum} alt='Ethereum Image Alt Text' width={90} height={90}/>
        <p> Welcome to the Wallet Dashboard</p>
        </div>
     ):(
      <div>
        <h5>Verified Account <span className='tick'>&#10004;</span></h5>
        <p>Ether Account and balance Checker <br/> Find account details</p>
        <div className="buttons">
          <button className='primary ghost' onClick={()=>{

          }}>
            Ether Account Details
          </button>
        </div>
        </div>
     )
    
    }
    {!account && !connect ? (
      <div className="buttons">
        <button className='primary' onClick={()=>connectWallet()}>Connect Wallet</button>
      </div>
    ):
    (
      <div className="details">
        <h6>Ethers</h6>
        <ul>
          <li>Account</li>
          <li>{account}</li>
          <li>Balance</li>
          <li>{balance}</li>
        </ul>
      </div>
    )
    }
  </div>
  );
};
