interface AuctionResponse {
  data: {
    auctions: {
      id: string;
      tokenBase: string;
      tokenQuote: string;
      amountBase: string;
      blockCreated: string;
      blockInit: string;
    }[];
  };
}

interface Auction {
  id: string;
  tokenBase: string;
  tokenQuote: string;
  amountBase: bigint;
  blockCreated: number;
  blockInit: number;
}

class SubgraphService {
  async getAuctions(): Promise<Auction[]> {
    const response = await fetch(
      'https://api.thegraph.com/subgraphs/name/destiner/hollander-goerli',
      {
        method: 'POST',
        body: JSON.stringify({
          query: `
          query {
            auctions(first: 20, orderBy: blockCreated, orderDirection: desc) {
              id
              tokenBase
              tokenQuote
              amountBase
              blockCreated
              blockInit
            }
          }
        `,
        }),
        headers: {
          'content-type': 'application/json',
        },
      },
    );

    const json = (await response.json()) as AuctionResponse;
    return json.data.auctions.map((auction) => {
      return {
        id: auction.id,
        tokenBase: auction.tokenBase,
        tokenQuote: auction.tokenQuote,
        amountBase: BigInt(auction.amountBase),
        blockCreated: parseInt(auction.blockCreated),
        blockInit: parseInt(auction.blockInit),
      };
    });
  }
}

export type { Auction };

export default SubgraphService;
