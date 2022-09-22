const HOUR = 60 * 60;
const BLOCK_TIME = 12;

function blocksToHours(blocks: number): number {
  return parseFloat(((blocks * BLOCK_TIME) / HOUR).toFixed(2));
}

function hoursToBlocks(hours: number): number {
  return Math.floor((hours * HOUR) / BLOCK_TIME);
}

export { blocksToHours, hoursToBlocks };
