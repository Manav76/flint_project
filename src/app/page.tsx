"use client"
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { JsonRpcApiProvider } from 'ethers';
import { JsonRpcProvider ,  } from 'ethers';
import Ethereum from '../assets/Eth.png'
import Profile from '../assets/Nft.png'
import { useToast } from '@chakra-ui/toast';

import Web3Modal from "web3modal";
export default function Home() {
  const toast = useToast();

  const [account, setAccount] = useState("");
  const [balance , setBalance] = useState("");
  const [connect , setConnect] = useState(false);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [showPercentageChange, setShowPercentageChange] = useState(false);
  const failMessage = "Please Click on the Connect Wallet button and proceed further to the main dashboard"
  const provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/b27ad50709544a07a600c08e4a7ffe95`);
  //function to fetch out the historical balance ,storing it in a state and then comparing with the current balance 
  const fetchHistoricalBalance = async ()=>{
    try {
      const twelveHoursAgo = Math.floor((Date.now() / 1000) - 12 * 60 * 60); // 12 hours ago

      const balanceTwelveHoursAgo = await provider.getBalance(account, twelveHoursAgo);
      const formattedBalanceTwelveHoursAgo = ethers.formatEther(balanceTwelveHoursAgo);

      // Fetch current balance
      const nativeTokenBalance = await provider.getBalance(account);
      const formattedBalance = ethers.formatEther(nativeTokenBalance);

      const startBalance = parseFloat(formattedBalanceTwelveHoursAgo);
      const endBalance = parseFloat(formattedBalance);
      const change = endBalance - startBalance;
      const percentageChange = (change / startBalance) * 100;

   
      setPercentageChange(percentageChange);
      console.log(percentageChange);
      setShowPercentageChange(true);
      //using a toast to display when the percentage is less than 10
      if (percentageChange < 10) {
       toast({
        
        description: "Balance percentage for the past 12 hours has gone below 10%",
        status: "info",
        duration: 5000, // 5 seconds
        isClosable: true,
       })
      }
    } catch (error) {
      console.error('Error fetching historical balance:', error);
    }
  }
  //function to check if the wallet connected , fetches the accounts and used the first account in the array for it
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
   fetchHistoricalBalance()
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
         
              <button className='primary ghost' onClick={() => {
              fetchHistoricalBalance()
              }}>
                Percentage Change in Balance
              </button>
        </div>
        </div>
     )
    
    }
    {(account && connect) ? (
        <div className="details">
          <h6>Ethers</h6>
          <ul>
            <li>Account Unique Id</li>
            <li>{account}</li>
            <li>Balance</li>
            <li>{balance}</li>
          </ul>
        </div>
      ) : null}

      {(account && !connect && percentageChange!==null) ? (
        <div className="details">
          <h6>Ethers</h6>
          <ul>
            <li>The percentage Change</li>
            <li>{percentageChange}%</li>
            <li>Account Unique Id</li>
            <li>{account}</li>
            <li>Balance</li>
            <li>{balance}</li>
          </ul>
        </div>
      ) : null}

      {!account && !connect && !percentageChange ? (
        <div className="buttons">
          <button className='primary' onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : null}
    
    </div>
  );
};
