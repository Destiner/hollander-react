import { describe, it, expect } from 'vitest';

import {
  DAI_TESTNET_ADDRESS,
  USDC_TESTNET_ADDRESS,
  WETH_TESTNET_ADDRESS,
} from './assets';
import {
  auctionPriceToWei,
  auctionPriceFromWei,
  formatAddress,
  formatNumber,
  formatValue,
  formatShare,
} from './formatters';

describe('Formatters', () => {
  it('address formatting', () => {
    const address = '0x9D96b0561be0440eBE93e79FE06a23BBe8270f90';

    expect(formatAddress(address).startsWith('0x9D96'));
    expect(formatAddress(address).endsWith('0f90'));
  });

  it('number formatting', () => {
    expect(formatNumber(10)).toEqual('10');
    expect(formatNumber(0.123)).toEqual('0.1');
    expect(formatNumber(34.603)).toEqual('34.6');
  });

  it('value formatting', () => {
    expect(formatValue(10)).toEqual('$10');
    expect(formatValue(0.123)).toEqual('$0.1');
    expect(formatValue(34.603)).toEqual('$34.6');
  });

  it('share formatting', () => {
    expect(formatShare(0.03)).toEqual('3.0%');
    expect(formatShare(0.32)).toEqual('32.0%');
    expect(formatShare(0.0745)).toEqual('7.45%');
  });

  it('auction price to wei conversion', () => {
    expect(
      auctionPriceToWei(USDC_TESTNET_ADDRESS, WETH_TESTNET_ADDRESS, 0.0005),
    ).toEqual(500000000000000000000000000n);
    expect(
      auctionPriceToWei(DAI_TESTNET_ADDRESS, WETH_TESTNET_ADDRESS, 0.0005),
    ).toEqual(500000000000000n);
    expect(
      auctionPriceToWei(WETH_TESTNET_ADDRESS, USDC_TESTNET_ADDRESS, 2000),
    ).toEqual(2000000000n);
    expect(
      auctionPriceToWei(WETH_TESTNET_ADDRESS, DAI_TESTNET_ADDRESS, 2000),
    ).toEqual(2000000000000000000000n);
  });

  it('auction price from wei conversion', () => {
    expect(
      auctionPriceFromWei(
        USDC_TESTNET_ADDRESS,
        WETH_TESTNET_ADDRESS,
        500000000000000000000000000n,
      ),
    ).toEqual(0.0005);
    expect(
      auctionPriceFromWei(
        DAI_TESTNET_ADDRESS,
        WETH_TESTNET_ADDRESS,
        500000000000000n,
      ),
    ).toEqual(0.0005);
    expect(
      auctionPriceFromWei(
        WETH_TESTNET_ADDRESS,
        USDC_TESTNET_ADDRESS,
        2000000000n,
      ),
    ).toEqual(2000);
    expect(
      auctionPriceFromWei(
        WETH_TESTNET_ADDRESS,
        DAI_TESTNET_ADDRESS,
        2000000000000000000000n,
      ),
    ).toEqual(2000);
  });
});
