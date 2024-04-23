import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { ErrorBoundary } from 'react-error-boundary';
import { TextField, Button, CircularProgress, Typography, Container, Box, Menu, MenuItem, IconButton } from '@mui/material';
import { abi, contractAddress } from './App';
import MoreVertIcon from '@mui/icons-material/MoreVert'

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

  // Estado para el menú
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // Variable para mostrar la lista de miembros
  const [showMembersList, setShowMembersList] = useState(false); // Definir showMembersList

  // Función para abrir el menú
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Función para cerrar el menú
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Función para manejar la selección de opción del menú
  const handleMenuItemClick = (option) => {
    setSelectedOption(option);
    handleMenuClose(); // Cerrar el menú después de seleccionar una opción

    // Mostrar la lista de miembros al seleccionar la tercera opción
    if (option === "Listar miembros de la comunidad") {
      setShowMembersList(true);
    } else {
      setShowMembersList(false);
    }
  };

  // Resto del código sin cambios...

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
        {/* Menú */}
        <IconButton
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          size="large"
          color="primary"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuItemClick("Crear Consulta a Votar")}>Opción 1: Crear Consulta a Votar</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Realizar Votación")}>Opción 2: Realizar Votación</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Listar miembros de la comunidad")}>Opción 3: Listar miembros de la comunidad</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Ingreso de miembros de la comunidad")}>Opcion 4: Ingreso de miembros de la comunidad</MenuItem>
        </Menu>
        <Typography variant="h4" component="h1" gutterBottom>
          Sistema de Votación de Comunidades
        </Typography>
        <Box sx={{  mb: 2, border: '1px solid black', padding: '10px', marginTop: '20px' }}>
          {/* Información de la Red Ethereum y Cuentas */}
          <Typography variant="h6" gutterBottom>Información de la Red Ethereum y Cuentas</Typography>
          {Object.entries(currentAccount).map(([key, value]) => (
            <Typography key={key}>{`${key}: ${value}`}</Typography>
          ))}
          <Typography>Red Actual: {currentNetwork}</Typography>
        </Box>
        <Box sx={{ mb: 2, border: '1px solid black', padding: '10px' }}>
          {/* Información del Contrato */}
          <Typography variant="h6">Información del Contrato</Typography>
          <Typography><strong>Administrador:</strong> {adminName}</Typography>
          <Typography><strong>Dirección:</strong> {communityAddress}</Typography>
          <Typography><strong>Nombre de la Comunidad:</strong> {communityName}</Typography>
        </Box>
        {/*
          Nuevo contenedor que se muestra al hacer clic en la tercera opción del menú
        */}
        {showMembersList && (
          <Box sx={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>Miembros Registrados</Typography>
            {/* Lista de miembros */}
          </Box>
        )}
        {/*
          Nuevo contenedor que se muestra al hacer clic en la cuarta opción del menú
        */}
        {selectedOption === "Ingreso de miembros de la comunidad" && (
          <Box sx={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
            {/* Registro de Miembros */}
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
        )}
      </Container>
    </ErrorBoundary>
  );
}
