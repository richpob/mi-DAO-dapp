import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractAddress = '0x055e3df582b840a19b583d04c4e85225939fb303';
const abi = [/* ABI del contrato aquí */];

function ContractInteraction() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setProvider(provider);
        setAccount(accounts[0]);
        const signer = provider.getSigner();
        setContract(new ethers.Contract(contractAddress, abi, signer));
      } else {
        console.error('Please install MetaMask!');
      }
    }
    connectWallet();
  }, []);

  async function callFunction() {
    if (!contract) return;
    // Ejemplo de interacción
    const response = await contract.someFunction();
    console.log(response);
  }

  return (
    <div>
      <h1>Interact with the Smart Contract</h1>
      <button onClick={callFunction}>Call Function</button>
    </div>
  );
}

export default ContractInteraction;
