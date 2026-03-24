import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private contractABI: any;
  private contractAddress: string;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545');
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // Default Hardhat/Ganache key
      this.provider,
    );
    this.contractAddress = process.env.CONTRACT_ADDRESS || '';
  }

  async onModuleInit() {
    try {
      const abiPath = path.resolve(__dirname, '../../../blockchain/build/contracts/SecureChain.json');
      if (fs.existsSync(abiPath)) {
        const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
        this.contractABI = contractJson.abi;
        if (this.contractAddress && this.contractABI) {
          this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.wallet);
        }
      }
    } catch (error) {
      console.warn('Blockchain ABI not found or invalid. Make sure to compile and deploy the contract.', error.message);
    }
  }

  async recordPolicy(userId: string, policyId: string, premium: string) {
    if (!this.contract) return null;
    try {
      const tx = await this.contract.recordPolicy(userId, policyId, ethers.parseEther(premium));
      return await tx.wait();
    } catch (error) {
      console.error('Error recording policy on blockchain:', error);
      throw error;
    }
  }

  async submitClaim(claimId: string, policyId: string, amount: string) {
    if (!this.contract) return null;
    try {
      const tx = await this.contract.submitClaim(claimId, policyId, ethers.parseEther(amount));
      return await tx.wait();
    } catch (error) {
      console.error('Error submitting claim on blockchain:', error);
      throw error;
    }
  }

  async processClaim(claimId: string, status: number, reason: string) {
    if (!this.contract) return null;
    try {
      const tx = await this.contract.processClaim(claimId, status, reason);
      return await tx.wait();
    } catch (error) {
      console.error('Error processing claim on blockchain:', error);
      throw error;
    }
  }

  async getClaim(claimId: string) {
    if (!this.contract) return null;
    return await this.contract.claims(claimId);
  }
}
