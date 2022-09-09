import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import HolAsset from '../../components/_common/HolAsset';
import HolButton from '../../components/_common/HolButton';
import HolInput from '../../components/_common/HolInput';
import { useAppSelector } from '../../hooks/useAppSelector';
import HollanderService from '../../services/hollander';
import { USDC_TESTNET_ADDRESS, WETH_TESTNET_ADDRESS } from '../../utils/assets';
import { hoursToBlocks } from '../../utils/converters';
import { auctionPriceToWei, toWei } from '../../utils/formatters';

const service = new HollanderService();

const Title = styled.h2`
  margin: 8px 0;
`;

const Subtitle = styled.h3`
  margin: 4px 0;
`;

const Page = styled.div`
  margin: 64px 24px 0;
`;

const Form = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const InputLabel = styled.div`
  padding: 4px;
`;

const Pair = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AssetSelector = styled(InputLabel)`
  margin: 4px;

  &:hover {
    border-radius: 8px;
    background: #eee;
    cursor: pointer;
  }
`;

const Params = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Param = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ParamName = styled.span`
  width: 120px;
`;

const NewAuctionRoute = (): JSX.Element => {
  const navigate = useNavigate();

  const walletAddress = useAppSelector((state) => state.wallet.address);
  const isConnected = useMemo(() => walletAddress !== '', [walletAddress]);

  const [amount, setAmount] = useState('');
  const assetIn = WETH_TESTNET_ADDRESS;
  const assetOut = USDC_TESTNET_ADDRESS;

  const [initialPrice, setInitialPrice] = useState('');
  const [halvingPeriod, setHalvingPeriod] = useState('');
  const [swapPeriod, setSwapPeriod] = useState('');

  const [hasPendingTx, setPendingTx] = useState(false);

  async function createAuction(): Promise<void> {
    if (!isConnected) {
      return;
    }
    await service.connect();
    const amountBase = toWei(assetOut, parseFloat(amount));
    const price = auctionPriceToWei(
      assetOut,
      assetIn,
      parseFloat(initialPrice),
    );
    const halvingPeriodBlocks = hoursToBlocks(parseFloat(halvingPeriod));
    const swapPeriodBlocks = hoursToBlocks(parseFloat(swapPeriod));
    setPendingTx(true);
    const auction = await service.createAuction(
      assetOut,
      assetIn,
      amountBase,
      price,
      halvingPeriodBlocks,
      swapPeriodBlocks,
    );
    setPendingTx(false);
    if (!auction) {
      return;
    }
    navigate(`/auction/${auction}`);
  }

  return (
    <>
      <Page>
        <Title>New Auction</Title>
        <Form>
          <div>
            <Subtitle>Order</Subtitle>
            <HolInput
              value={amount}
              onUserInput={(value): void => setAmount(value)}
            >
              <Pair>
                <AssetSelector>
                  <HolAsset
                    showIcon
                    showSymbol
                    address={assetOut}
                  />
                </AssetSelector>
                →
                <AssetSelector>
                  <HolAsset
                    showIcon
                    showSymbol
                    address={assetIn}
                  />
                </AssetSelector>
              </Pair>
            </HolInput>
          </div>
          <div>
            <Subtitle>Params</Subtitle>
            <Params>
              <Param>
                <ParamName>Initial price</ParamName>
                <HolInput
                  value={initialPrice}
                  onUserInput={(value): void => setInitialPrice(value)}
                >
                  <InputLabel>
                    <HolAsset
                      size="s"
                      showIcon
                      showSymbol
                      address={assetIn}
                    />
                  </InputLabel>
                </HolInput>
              </Param>
              <Param>
                <ParamName>Halving period</ParamName>
                <HolInput
                  value={halvingPeriod}
                  onUserInput={(value): void => setHalvingPeriod(value)}
                >
                  <InputLabel>hours</InputLabel>
                </HolInput>
              </Param>
              <Param>
                <ParamName>Swap period</ParamName>
                <HolInput
                  value={swapPeriod}
                  onUserInput={(value): void => setSwapPeriod(value)}
                >
                  <InputLabel>hours</InputLabel>
                </HolInput>
              </Param>
            </Params>
          </div>
          <div>
            <HolButton
              label="Create"
              isLoading={hasPendingTx}
              onClick={createAuction}
            />
          </div>
        </Form>
      </Page>
    </>
  );
};

export default NewAuctionRoute;
