const USDC_TESTNET_ADDRESS = '0x302075a4f924baa2f1cdaadedf42a62cc69f5205';
const DAI_TESTNET_ADDRESS = '0xd6e44bcb6902c66c16f388cae6c48dd65bbcdb53';
const WETH_TESTNET_ADDRESS = '0xedf20323fd5ee2d98ee74e87304644d439b8c367';
const UNI_TESTNET_ADDRESS = '0xd6f5de9a631036215348a1efcf88b3ad2b9d4ecf';
const BAL_TESTNET_ADDRESS = '0x26c21aa2d6cfc72bc7fa281a67a485ce5da17dd3';
const MKR_TESTNET_ADDRESS = '0xa3075adaa905ae900cc43a111b1addb97ad2b75c';

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
const BAL_ADDRESS = '0xba100000625a3754423978a60c9317c58a424e3D';
const MKR_ADDRESS = '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2';

function getAssets(): string[] {
  return [
    USDC_TESTNET_ADDRESS,
    DAI_TESTNET_ADDRESS,
    WETH_TESTNET_ADDRESS,
    UNI_TESTNET_ADDRESS,
    BAL_TESTNET_ADDRESS,
    MKR_TESTNET_ADDRESS,
  ];
}

function getDecimals(address: string): number {
  const map: Record<string, number> = {
    [USDC_TESTNET_ADDRESS]: 6,
    [DAI_TESTNET_ADDRESS]: 18,
    [WETH_TESTNET_ADDRESS]: 18,
    [UNI_TESTNET_ADDRESS]: 18,
    [BAL_TESTNET_ADDRESS]: 18,
    [MKR_TESTNET_ADDRESS]: 18,
  };
  return map[address.toLowerCase()];
}

function getIconUrl(testnetAddress: string): string {
  const addressMap: Record<string, string> = {
    [USDC_TESTNET_ADDRESS]: USDC_ADDRESS,
    [DAI_TESTNET_ADDRESS]: DAI_ADDRESS,
    [WETH_TESTNET_ADDRESS]: WETH_ADDRESS,
    [UNI_TESTNET_ADDRESS]: UNI_ADDRESS,
    [BAL_TESTNET_ADDRESS]: BAL_ADDRESS,
    [MKR_TESTNET_ADDRESS]: MKR_ADDRESS,
  };
  const address = addressMap[testnetAddress.toLowerCase()];
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
}

function getSymbol(testnetAddress: string): string {
  const map: Record<string, string> = {
    [USDC_TESTNET_ADDRESS]: 'USDC',
    [DAI_TESTNET_ADDRESS]: 'DAI',
    [WETH_TESTNET_ADDRESS]: 'WETH',
    [UNI_TESTNET_ADDRESS]: 'UNI',
    [BAL_TESTNET_ADDRESS]: 'BAL',
    [MKR_TESTNET_ADDRESS]: 'MKR',
  };
  return map[testnetAddress.toLowerCase()];
}

export {
  DAI_TESTNET_ADDRESS,
  USDC_TESTNET_ADDRESS,
  WETH_TESTNET_ADDRESS,
  getAssets,
  getDecimals,
  getIconUrl,
  getSymbol,
};
