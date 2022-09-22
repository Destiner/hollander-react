import { formatUnits, parseUnits } from '@ethersproject/units';

import { WETH_TESTNET_ADDRESS, getDecimals } from './assets';

function toWei(address: string, amount: number): bigint {
  const decimals = getDecimals(address);
  return parseUnits(amount.toFixed(decimals), decimals).toBigInt();
}

function fromWei(address: string, amount: bigint): number {
  const decimals = getDecimals(address);
  return parseFloat(formatUnits(amount, decimals));
}

// (USDC, WETH, 0.0005) -> 0.0005 * 10e18 * 10e18 / 10e6
// (DAI, WETH, 0.0005) -> 0.0005 * 10e18
// (WETH, USDC, 2000) -> 2000 * 10e6
// (WETH, DAI, 2000) -> 2000 * 10e18
function auctionPriceToWei(
  assetBase: string,
  assetQuote: string,
  value: number,
): bigint {
  return toWei(
    assetQuote,
    fromWei(assetBase, toWei(WETH_TESTNET_ADDRESS, value)),
  );
}

function auctionPriceFromWei(
  assetBase: string,
  assetQuote: string,
  value: bigint,
): number {
  return fromWei(
    assetQuote,
    toWei(assetBase, fromWei(WETH_TESTNET_ADDRESS, value)),
  );
}

function formatAddress(address: string): string {
  return `${address.substring(0, 8)}…${address.substring(36)}`;
}

function formatNumber(value: number): string {
  const valueFormat = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return valueFormat.format(value);
}

function formatValue(value: number): string {
  const valueFormat = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    style: 'currency',
    currency: 'usd',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return valueFormat.format(value);
}

function formatShare(value: number): string {
  const valueFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
  return valueFormat.format(value);
}

export {
  auctionPriceToWei,
  auctionPriceFromWei,
  formatAddress,
  formatNumber,
  formatValue,
  formatShare,
  fromWei,
  toWei,
};
