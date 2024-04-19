import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ErrorBoundary } from 'react-error-boundary';
import { TextField, Button, CircularProgress, Typography, Container, Box } from '@mui/material';

const contractAddress = require("./contracts/Community.json").networks[1337].address;
const abi = require("./contracts/Community.json").abi;

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
        alert('Por favor, instale MetaMask!');
      }
    }

    loadWeb3();
  }, []);

  const registerMember = async () => {
    if (!contract || !member || !tokens) {
      alert('Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    try {
      await contract.methods.registerMember(member, tokens).send({ from: accounts[0] });
      alert('Miembro registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar el miembro:', error);
      alert('Error al registrar el miembro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary onError={(error, componentStack) => {
      console.error('Error RPC:', error);
      alert('Se produjo un error al realizar una llamada RPC. Por favor, inténtelo de nuevo más tarde.');
    }}>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Sistema de Votación de Comunidades
        </Typography>
        <Box sx={{ mb: 2, border: '1px solid black', padding: '10px' }}>
          <Typography variant="h6">Información del Contrato</Typography>
          <Typography><strong>Administrador:</strong> {adminName}</Typography>
          <Typography><strong>Dirección:</strong> {communityAddress}</Typography>
          <Typography><strong>Nombre de la Comunidad:</strong> {communityName}</Typography>
        </Box>
        <Box sx={{ border: '1px solid black', padding: '10px' }}>
          <Typography variant="h6" gutterBottom>Registro de Miembros</Typography>
          <TextField
            fullWidth
            label="Dirección del Miembro"
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
            {loading ? <CircularProgress size={24} /> : 'Guardar Propietario'}
          </Button>
        </Box>
      </Container>
    </ErrorBoundary>
  );
}

export default App;
