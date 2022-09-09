import { BigNumber } from '@ethersproject/bignumber';
import {
  Web3Provider,
  ExternalProvider,
  TransactionReceipt,
  Provider,
  JsonRpcSigner,
  AlchemyProvider,
} from '@ethersproject/providers';

import useEnv from '../hooks/useEnv';

const { alchemyKey } = useEnv();

const CHAIN_ID = 5;

class EthereumService {
  address: string | null;
  signer: JsonRpcSigner | null;
  provider: Provider | null;

  constructor() {
    this.address = null;
    this.provider = getProvider();
    this.signer = getSigner();
  }

  async connect(): Promise<string | null> {
    const ethereum = window.ethereum as ExternalProvider;
    if (!ethereum.request) {
      return null;
    }
    const accounts: string[] = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    const [address] = accounts;
    this.address = address;
    return address;
  }

  async getBalance(): Promise<BigNumber | null> {
    if (!this.address || !this.provider) {
      return null;
    }
    return await this.provider.getBalance(this.address);
  }

  async send(
    to: string,
    gasLimit: BigNumber,
    gasPrice: BigNumber,
    data: string,
    value: BigNumber,
  ): Promise<TransactionReceipt | null> {
    if (!this.signer) {
      return null;
    }
    const tx = await this.signer.sendTransaction({
      to,
      gasLimit,
      gasPrice,
      data,
      value,
    });
    return await tx.wait(1);
  }
}

function getProvider(): Provider {
  return new AlchemyProvider(CHAIN_ID, alchemyKey);
}

function getSigner(): JsonRpcSigner | null {
  if (!window.ethereum) {
    return null;
  }
  const signingProvider = new Web3Provider(window.ethereum, CHAIN_ID);
  return signingProvider.getSigner();
}

export default EthereumService;
