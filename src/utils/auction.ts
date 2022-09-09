type AuctionStatus = 'draft' | 'active' | 'complete';

function getStatus(blockStart: number, amountOut: bigint): AuctionStatus {
  if (blockStart === 0) {
    return 'draft';
  }
  if (amountOut === 0n) {
    return 'complete';
  }
  return 'active';
}

export { getStatus };

export type { AuctionStatus };
