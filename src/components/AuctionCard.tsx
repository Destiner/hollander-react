import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { fromWei } from '../utils/formatters';

import HolAsset from './_common/HolAsset';
import HolCard from './_common/HolCard';

interface Props {
  address: string;
  assetIn: string;
  assetOut: string;
  amountIn: bigint;
  amountOut: bigint;
  amountOutTotal: bigint;
}

const Card = styled(HolCard)`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 16px;
`;

const Param = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 16px;
`;

const AuctionCard = ({
  address,
  assetIn,
  assetOut,
  amountIn,
  amountOut,
  amountOutTotal,
}: Props): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Card onClick={(): void => navigate(`/auction/${address}`)}>
      <Header>
        <HolAsset
          showIcon
          showSymbol
          address={assetOut}
        />
        →
        <HolAsset
          showIcon
          showSymbol
          address={assetIn}
        />
      </Header>
      <div>
        <Param>
          Sell amount: {fromWei(assetOut, amountOut)} /
          {fromWei(assetOut, amountOutTotal)}
          <HolAsset
            size="s"
            showSymbol
            address={assetOut}
          />
        </Param>
        <Param>
          Accumulated: {fromWei(assetIn, amountIn)}
          <HolAsset
            size="s"
            showSymbol
            address={assetIn}
          />
        </Param>
      </div>
    </Card>
  );
};

export default AuctionCard;
