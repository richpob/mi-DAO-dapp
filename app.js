import Web3 from 'web3';

function App() {
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('MetaMask not detected!');
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log('Connected accounts:', accounts);
  }

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  return <div>Web3 Data Display</div>;
}

export default App;
