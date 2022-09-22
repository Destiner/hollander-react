import { describe, it, expect } from 'vitest';

import { blocksToHours, hoursToBlocks } from './converters';

describe('Converter', () => {
  it('block to hour convertion', () => {
    expect(blocksToHours(0)).toEqual(0);
    expect(blocksToHours(10)).toEqual(0.03);
    expect(blocksToHours(150)).toEqual(0.5);
    expect(blocksToHours(1200)).toEqual(4);
  });

  it('hour to block convertion', () => {
    expect(hoursToBlocks(0)).toEqual(0);
    expect(hoursToBlocks(0.1)).toEqual(30);
    expect(hoursToBlocks(1)).toEqual(300);
  });
});
