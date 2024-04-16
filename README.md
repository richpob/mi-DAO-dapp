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
