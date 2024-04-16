# Sistema de Votación para una Comunidad

## Descripción
Este proyecto es un sistema de votación descentralizado para una comunidad, implementado utilizando un smart contract en Ethereum y una interfaz de usuario desarrollada en React. Permite a los miembros registrados votar en propuestas y ver los resultados de las votaciones de manera transparente y segura.

## Tecnologías Utilizadas
- **Solidity**: Lenguaje de programación para escribir smart contracts.
- **Ethereum Testnet (Sepolia)**: Red de prueba donde se despliega el contrato.
- **MetaMask**: Wallet de Ethereum para interactuar con el blockchain.
- **Remix**: IDE de Ethereum usado para desarrollar y desplegar el smart contract.
- **Visual Studio Code**: Editor de código utilizado para el desarrollo del frontend.
- **React**: Biblioteca de JavaScript para construir la interfaz de usuario.
- **Web3.js**: Biblioteca para interactuar con nodos Ethereum desde el navegador.
- **Material-UI**: Biblioteca de componentes React para un diseño de interfaz moderno y responsive.

## Smart Contract

El contrato está desplegado en la dirección: [0x055e3df582b840a19b583d04c4e85225939fb303](https://sepolia.etherscan.io/address/0x055e3df582b840a19b583d04c4e85225939fb303#readContract) en la red de prueba Sepolia.

### Funcionalidades del Contrato
- **Registro de miembros**: Los miembros pueden registrarse almacenando una cantidad de tokens que les permitirá votar.
- **Creación de propuestas**: Los administradores pueden crear propuestas sobre las cuales los miembros podrán votar.
- **Votación**: Los miembros utilizan sus tokens para votar en propuestas activas.
- **Ejecución de propuestas**: Las propuestas que alcanzan los votos necesarios pueden ser ejecutadas por los administradores.

### Métodos Principales
```solidity
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Community is Ownable {
    // Variables de estado y constructor aquí

    function registerMember(address member, uint256 tokens) public onlyOwner {
        // Lógica de registro
    }

    function createProposal(string memory description) public onlyOwner {
        // Lógica para crear propuestas
    }

    function voteOnProposal(uint256 proposalId, uint256 votes) public {
        // Lógica para votar en propuestas
    }

    function executeProposal(uint256 proposalId) public onlyOwner {
        // Lógica para ejecutar propuestas
    }
}
```
## Frontend
El frontend está desarrollado en React y utiliza Web3.js para interactuar con el contrato inteligente a través de MetaMask.

### Componentes Principales
Formulario de Registro de Miembro: Permite a los usuarios registrarse como miembros.
Creador de Propuestas: Interfaz para que los administradores creen nuevas propuestas.
Votaciones: Permite a los miembros votar en propuestas activas.

### Ejemplo de Uso de Componentes
```js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { TextField, Button, CircularProgress, Typography, Container, Box } from '@mui/material';

const contractAddress = '0x055e3df582b840a19b583d04c4e85225939fb303';
const abi = []; // Acá va el ABI del contrato

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

```
### Instalación y Configuración
Para ejecutar este proyecto localmente, necesitarás instalar las dependencias y configurar MetaMask en tu navegador.

### Prerrequisitos
Node.js
npm o yarn
MetaMask instalado en tu navegador
### Pasos para la Instalación
Clona el repositorio.
Instala las dependencias:

```bash
npm install
npm start

```
## Licencia
Este proyecto está bajo la Licencia MIT.
