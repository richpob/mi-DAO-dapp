import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { TextField, Button, CircularProgress, Typography, Container, Box } from '@mui/material';

const contractAddress = '0x055e3df582b840a19b583d04c4e85225939fb303';
const abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_address","type":"string"},{"internalType":"string","name":"_president","type":"string"},{"internalType":"string","name":"_admin","type":"string"},{"internalType":"uint256","name":"_creationDate","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ProposalCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"votes","type":"uint256"}],"name":"VoteReceived","type":"event"},{"inputs":[],"name":"adminName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"communityAddress","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"communityName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"description","type":"string"}],"name":"createProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"creationDate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"executeProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"memberTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presidentName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"member","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"registerMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint256","name":"votes","type":"uint256"}],"name":"voteOnProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}];

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [communityAddress, setCommunityAddress] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [member, setMember] = useState('');
  const [tokens, setTokens] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(abi, contractAddress);
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);

        const adminName = await contract.methods.adminName().call();
        const communityAddr = await contract.methods.communityAddress().call();
        const communityNm = await contract.methods.communityName().call();

        setAdminName(adminName);
        setCommunityAddress(communityAddr);
        setCommunityName(communityNm);
      } else {
        alert('Please install MetaMask!');
      }
    }

    loadWeb3();
  }, []);

  const registerMember = async () => {
    if (!contract || !member || !tokens) {
      alert('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await contract.methods.registerMember(member, tokens).send({ from: accounts[0] });
      alert('Member registered successfully');
    } catch (error) {
      console.error('Error registering member:', error);
      alert('Failed to register member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Community Contract Interaction
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Contract Information</Typography>
        <Typography><strong>Admin Name:</strong> {adminName}</Typography>
        <Typography><strong>Community Address:</strong> {communityAddress}</Typography>
        <Typography><strong>Community Name:</strong> {communityName}</Typography>
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>Register Member</Typography>
        <TextField
          fullWidth
          label="Member Address"
          value={member}
          onChange={e => setMember(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Tokens"
          type="number"
          value={tokens}
          onChange={e => setTokens(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={registerMember}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Register Member'}
        </Button>
      </Box>
    </Container>
  );
}

export default App;
