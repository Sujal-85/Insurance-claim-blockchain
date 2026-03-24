import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import SecureChainArtifact from './InsuranceClaimSystem.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x7f5b9BA607e3c9d6CC9bb829722325eb05f1659B";
// We default to the Remix deployed address if no .env exists.

export const hasWallet = () => {
  return typeof window !== 'undefined' && !!window.ethereum;
};

export const getProvider = () => {
  if (hasWallet()) {
    return new BrowserProvider(window.ethereum);
  }
  console.warn("Please install MetaMask!");
  return null;
};

export const getContractWithSigner = async () => {
  const provider = getProvider();
  if (!provider) throw new Error("No crypto wallet found. Please install MetaMask to perform transactions.");
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, SecureChainArtifact.abi, signer);
};

export const getContractReadOnly = () => {
  const provider = getProvider();
  if (!provider) {
    // Fallback to a read-only HTTP provider if MetaMask is not installed
    const fallbackProvider = new JsonRpcProvider("http://127.0.0.1:8545");
    return new Contract(CONTRACT_ADDRESS, SecureChainArtifact.abi, fallbackProvider);
  }
  return new Contract(CONTRACT_ADDRESS, SecureChainArtifact.abi, provider);
};

export const getSignerAddress = async () => {
  try {
    const provider = getProvider();
    if (!provider) return "";
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (err) {
    return "";
  }
};

// Add listeners to reload the app when the user switches accounts or networks in MetaMask
if (typeof window !== 'undefined' && window.ethereum) {
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });
  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}

