import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AuctionCard from '../../components/AuctionCard';
import HolButton from '../../components/_common/HolButton';
import Erc20Service from '../../services/erc20';
import SubgraphService from '../../services/subgraph';

const erc20Service = new Erc20Service();
const subgraphService = new SubgraphService();

interface Auction {
  address: string;
  assetIn: string;
  assetOut: string;
  amountIn: bigint;
  amountOut: bigint;
  amountOutTotal: bigint;
}

const Page = styled.div`
  margin: 0 24px;
`;

const Hero = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  margin: 64px 0 128px;
`;

const HeroText = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  font-size: 32px;
`;

const CardList = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
  max-width: 480px;
`;

const Home = (): JSX.Element => {
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    fetchAuctions();
  }, []);

  async function fetchAuctions(): Promise<void> {
    const auctionList = await subgraphService.getAuctions();
    const amountsIn: bigint[] = [];
    const amountsOut: bigint[] = [];
    for (const auction of auctionList) {
      const amountIn = await erc20Service.balanceOf(
        auction.tokenQuote,
        auction.id,
      );
      const amountOut = await erc20Service.balanceOf(
        auction.tokenBase,
        auction.id,
      );
      if (amountIn === null || amountOut === null) {
        continue;
      }
      amountsIn.push(amountIn);
      amountsOut.push(amountOut);
    }
    const auctions = auctionList.map((auction, i) => {
      return {
        address: auction.id,
        assetIn: auction.tokenQuote,
        assetOut: auction.tokenBase,
        amountIn: amountsIn[i],
        amountOut: amountsOut[i],
        amountOutTotal: auction.amountBase,
      };
    });
    setAuctions(auctions);
  }

  return (
    <Page>
      <Hero>
        <HeroText>
          <div>Swap large amounts of tokens.</div>
          <div>No MEV, low price impact.</div>
        </HeroText>
        <div>
          <HolButton
            label="Create"
            onClick={(): void => {
              navigate('/auction/new');
            }}
          />
        </div>
      </Hero>
      {auctions.length > 0 ? (
        <>
          <h2>Latest auctions</h2>
          <CardList>
            {auctions.map((auction) => (
              <AuctionCard
                key={auction.address}
                address={auction.address}
                assetIn={auction.assetIn}
                assetOut={auction.assetOut}
                amountIn={auction.amountIn}
                amountOut={auction.amountOut}
                amountOutTotal={auction.amountOutTotal}
              />
            ))}
          </CardList>
        </>
      ) : null}
    </Page>
  );
};

export default Home;
