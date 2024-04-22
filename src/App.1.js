import React, { useState, useEffect, useCallback } from 'react'; // Añade useCallback aquí
import Web3 from 'web3';
import { ErrorBoundary } from 'react-error-boundary';
import { TextField, Button, CircularProgress, Typography, Container, Box } from '@mui/material';
import { abi, contractAddress } from './App';


export function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [communityAddress, setCommunityAddress] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [member, setMember] = useState('');
  const [tokens, setTokens] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [members, setMembers] = useState([]);

  const fetchMembers = useCallback(async () => {
    try {
      const totalMembers = await contract.methods.totalMembers().call();
      const membersData = [];
  
      for (let i = 0; i < totalMembers; i++) {
        const memberInfo = await contract.methods.members(i).call();
        membersData.push(memberInfo);
      }
  
      setMembers(membersData);
    } catch (error) {
      console.error('Error al obtener los miembros:', error);
    }
  }, [contract]);
  
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

  useEffect(() => {
    const onAccountChange = newAccount => {
      setCurrentAccount(newAccount);
    };

    const onNetworkChange = newNetwork => {
      setCurrentNetwork(newNetwork);
      if (newNetwork !== '0x539') {
        alert('¡No estás conectado a la red 0x539!');
      }
    };

    if (web3) {
      window.ethereum.on('accountsChanged', onAccountChange);
      window.ethereum.on('chainChanged', onNetworkChange);

      return () => {
        window.ethereum.removeListener('accountsChanged', onAccountChange);
        window.ethereum.removeListener('chainChanged', onNetworkChange);
      };
    }
  }, [web3]);

  useEffect(() => {
    if (contract) {
      fetchMembers();
    }
  }, [contract, fetchMembers]); // Agrega fetchMembers al array de dependencias
  

  async function handleFetchMembers() {
    setLoading(true);
    await fetchMembers(); // Llamada a fetchMembers() al hacer clic en el botón
    setLoading(false);
  }

  async function registerMember() {
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
  }

  return (
    <ErrorBoundary onError={(error, componentStack) => {
      console.error('Error RPC:', error);
      alert('Se produjo un error al realizar una llamada RPC. Por favor, inténtelo de nuevo más tarde.');
    }}>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Sistema de Votación de Comunidades
        </Typography>
        <Box sx={{  mb: 2, border: '1px solid black', padding: '10px', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>Información de la Red Ethereum y Cuentas</Typography>
          {Object.entries(currentAccount).map(([key, value]) => (
            <Typography key={key}>{`${key}: ${value}`}</Typography>
          ))}
          <Typography>Red Actual: {currentNetwork}</Typography>
        </Box>
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
            margin="normal" />
          <TextField
            fullWidth
            label="Tokens"
            type="number"
            value={tokens}
            onChange={e => setTokens(e.target.value)}
            margin="normal" />
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
        <Box sx={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>Miembros Registrados</Typography>
          {members.map((member, index) => (
            <Box key={index} sx={{ border: '1px solid black', padding: '5px', marginTop: '5px' }}>
              <Typography variant="body1" gutterBottom><strong>Dirección del Miembro:</strong> {member.address}</Typography>
              <Typography variant="body1" gutterBottom><strong>Tokens:</strong> {member.tokens}</Typography>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchMembers} // Asociar la función handleFetchMembers al botón
            disabled={loading}
            fullWidth
            style={{ marginTop: '10px' }} // Estilo adicional para separar el botón del contenido anterior
          >
            {loading ? <CircularProgress size={24} /> : 'Cargar Miembros'}
          </Button>
        </Box>
      </Container>
    </ErrorBoundary>
  );
}
