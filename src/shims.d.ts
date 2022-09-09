declare module '@metamask/jazzicon' {
  export default function jazzicon(size: number, seed: number): Node;
}

interface Window {
  ethereum: unknown;
}
