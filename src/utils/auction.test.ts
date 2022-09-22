import { describe, expect, it } from 'vitest';

import { AuctionStatus, getStatus } from './auction';

describe('Auction', () => {
  it('auction status', () => {
    expect(getStatus(0, 0n)).toEqual<AuctionStatus>('draft');
    expect(getStatus(10_000_000, 0n)).toEqual<AuctionStatus>('complete');
    expect(getStatus(10_000_000, 1000000000000n)).toEqual<AuctionStatus>(
      'active',
    );
  });
});
