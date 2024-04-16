import React, { useState, useEffect } from 'react'; // Importa useEffect y useState de React
import Web3 from 'web3';

function App() {
  const [web3, setWeb3] = useState(null); // Utiliza useState para manejar el estado de web3
  const [accounts, setAccounts] = useState([]); // Utiliza useState para manejar el estado de las cuentas

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable(); // Solicita al usuario que permita el acceso a sus cuentas
        setWeb3(web3Instance); // Guarda la instancia de web3 en el estado
        const accounts = await web3Instance.eth.getAccounts(); // Recupera las cuentas
        setAccounts(accounts); // Guarda las cuentas en el estado
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance); // Guarda la instancia de web3 en el estado
        const accounts = await web3Instance.eth.getAccounts(); // Recupera las cuentas
        setAccounts(accounts); // Guarda las cuentas en el estado
      } else {
        window.alert('MetaMask not detected!');
      }
    }

    loadWeb3();
  }, []);

  return (
    <div>
      <h1>Web3 Data Display</h1>
      <div>
        <strong>Accounts:</strong>
        {accounts.join(', ')}
      </div>
    </div>
  );
}

export default App;

