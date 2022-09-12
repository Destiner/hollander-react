import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { TransactionResponse } from '@ethersproject/providers';
import { Coder } from 'abi-coder';

import auctionAbi from '../abi/auction.json';
import factoryAbi from '../abi/factory.json';

import EthereumService from './ethereum';

const FACTORY_ADDRESS = '0x26704df470f36A45592EcC07E9CAcC7aB795A094';

interface Auction {
  owner: string;
  blockStart: bigint;
  tokenBase: string;
  tokenQuote: string;
  amountBaseTotal: bigint;
  initialPrice: bigint;
  halvingPeriod: bigint;
  swapPeriod: bigint;
}

class HollanderService extends EthereumService {
  async createAuction(
    tokenBase: string,
    tokenQuote: string,
    amountBase: bigint,
    initialPrice: bigint,
    halvingPeriod: number,
    swapPeriod: number,
  ): Promise<string | null> {
    if (!this.signer) {
      return null;
    }
    const contract = new Contract(FACTORY_ADDRESS, factoryAbi, this.signer);
    const tx: TransactionResponse = await contract.createAuction(
      tokenBase,
      tokenQuote,
      amountBase,
      initialPrice,
      halvingPeriod,
      swapPeriod,
    );
    const receipt = await tx.wait(2);
    const log = receipt.logs[0];
    const coder = new Coder(factoryAbi);
    const event = coder.decodeEvent(log.topics, log.data);
    if (event.name !== 'NewAuction') {
      return null;
    }
    return event.values.auction as string;
  }

  async init(auction: string): Promise<bigint | null> {
    if (!this.signer) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.signer);
    const tx: TransactionResponse = await contract.init();
    const receipt = await tx.wait();
    const log = receipt.logs[1];
    const coder = new Coder(auctionAbi);
    const event = coder.decodeEvent(log.topics, log.data);
    if (event.name !== 'Init') {
      return null;
    }
    return event.values.blockStart as bigint;
  }

  async buy(auction: string, amountBuy: bigint): Promise<void> {
    if (!this.signer) {
      return;
    }
    const contract = new Contract(auction, auctionAbi, this.signer);
    const tx: TransactionResponse = await contract.buy(amountBuy);
    await tx.wait();
  }

  async withdraw(auction: string): Promise<void> {
    if (!this.signer) {
      return;
    }
    const contract = new Contract(auction, auctionAbi, this.signer);
    const tx: TransactionResponse = await contract.withdraw();
    await tx.wait();
  }

  async getAuction(address: string): Promise<Auction> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(address, auctionAbi, this.provider);

    const owner = await contract.owner();
    const blockStart = await contract.blockStart();
    const tokenBase = await contract.tokenBase();
    const tokenQuote = await contract.tokenQuote();
    const amountBaseTotal = await contract.amountBase();
    const initialPrice = await contract.initialPrice();
    const halvingPeriod = await contract.halvingPeriod();
    const swapPeriod = await contract.swapPeriod();

    return {
      owner,
      blockStart,
      tokenBase,
      tokenQuote,
      amountBaseTotal,
      initialPrice,
      halvingPeriod,
      swapPeriod,
    };
  }

  async owner(auction: string): Promise<string | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return await contract.owner();
  }

  async blockStart(auction: string): Promise<bigint | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return ((await contract.blockStart()) as BigNumber).toBigInt();
  }

  async tokenBase(auction: string): Promise<string | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return await contract.tokenBase();
  }

  async tokenQuote(auction: string): Promise<string | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return await contract.tokenQuote();
  }

  async amountBase(auction: string): Promise<bigint | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return ((await contract.amountBase()) as BigNumber).toBigInt();
  }

  async initialPrice(auction: string): Promise<bigint | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return ((await contract.initialPrice()) as BigNumber).toBigInt();
  }

  async halvingPeriod(auction: string): Promise<bigint | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return ((await contract.halvingPeriod()) as BigNumber).toBigInt();
  }

  async swapPeriod(auction: string): Promise<bigint | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return ((await contract.swapPeriod()) as BigNumber).toBigInt();
  }

  async getPrice(auction: string, amount: bigint): Promise<bigint | null> {
    if (!this.provider) {
      return null;
    }
    const contract = new Contract(auction, auctionAbi, this.provider);
    return ((await contract.getPrice(amount)) as BigNumber).toBigInt();
  }
}

export default HollanderService;
