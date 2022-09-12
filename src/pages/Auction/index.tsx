import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import StatusBadge from '../../components/StatusBadge';
import HolAsset from '../../components/_common/HolAsset';
import HolButton from '../../components/_common/HolButton';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import Erc20Service from '../../services/erc20';
import HollanderService from '../../services/hollander';
import { setAllowance, setBalance } from '../../stores/asset';
import { AuctionStatus, getStatus } from '../../utils/auction';
import { blocksToHours } from '../../utils/converters';
import { auctionPriceFromWei, fromWei } from '../../utils/formatters';

interface Auction {
  owner: string;
  address: string;
  assetIn: string;
  assetOut: string;
  amountIn: bigint;
  amountOut: bigint;
  amountOutTotal: bigint;
  price: bigint;
  halvingPeriod: number;
  swapPeriod: number;
  blockStart: number;
}

const erc20Service = new Erc20Service();
const hollanderService = new HollanderService();

const Page = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h2`
  display: flex;
  gap: 8px;
`;

const Pair = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Params = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Param = styled.div`
  display: flex;
  gap: 4px;
  align-items: baseline;
`;

const AuctionRoute = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const walletAddress = useAppSelector((state) => state.wallet.address);
  const allowances = useAppSelector((state) => state.asset.allowances);
  const balances = useAppSelector((state) => state.asset.balances);

  const isConnected = useMemo(() => walletAddress !== '', [walletAddress]);

  const params = useParams();
  const address = useMemo(() => params.address as string, [params]);

  useEffect(() => {
    if (!address) {
      return;
    }
    fetch();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    if (!auction) {
      return;
    }
    fetchAsset(auction.assetOut, auction.address);
  }, [walletAddress]);

  const [auction, setAuction] = useState<Auction | null>(null);

  async function fetch(): Promise<void> {
    await fetchAuction(address);
    if (!auction) {
      return;
    }
    await fetchAsset(auction.assetOut, auction.address);
  }

  async function fetchAuction(auctionAddress: string): Promise<void> {
    const auction = await hollanderService.getAuction(auctionAddress);

    const amountQuote = await erc20Service.balanceOf(
      auction.tokenQuote,
      auctionAddress,
    );
    const amountBase = await erc20Service.balanceOf(
      auction.tokenBase,
      auctionAddress,
    );

    if (amountQuote === null || amountBase === null) {
      return;
    }

    const price =
      getStatus(parseInt(auction.blockStart.toString()), amountBase) !== 'draft'
        ? await hollanderService.getPrice(auctionAddress, 0n)
        : auction.initialPrice;

    if (!price) {
      return;
    }

    setAuction({
      owner: auction.owner,
      address: auctionAddress,
      assetIn: auction.tokenQuote,
      assetOut: auction.tokenBase,
      amountIn: amountQuote,
      amountOut: amountBase,
      amountOutTotal: auction.amountBaseTotal,
      price,
      halvingPeriod: parseInt(auction.halvingPeriod.toString()),
      swapPeriod: parseInt(auction.swapPeriod.toString()),
      blockStart: parseInt(auction.blockStart.toString()),
    });
  }

  async function fetchAsset(asset: string, auction: string): Promise<void> {
    if (!isConnected) {
      return;
    }
    await erc20Service.connect();
    const allowance = await erc20Service.allowance(
      asset,
      walletAddress,
      auction,
    );
    const balance = await erc20Service.balanceOf(asset, walletAddress);
    if (allowance !== null) {
      dispatch(
        setAllowance({
          asset,
          owner: walletAddress,
          spender: auction,
          value: allowance.toString(),
        }),
      );
    }
    if (balance !== null) {
      dispatch(
        setBalance({ asset, owner: walletAddress, value: balance.toString() }),
      );
    }
  }

  const status = useMemo<AuctionStatus | null>(() => {
    return auction ? getStatus(auction.blockStart, auction.amountOut) : null;
  }, [auction]);

  function getBalance(asset: string, owner: string): bigint {
    if (!balances[asset]) {
      return 0n;
    }
    if (!balances[asset][owner]) {
      return 0n;
    }
    return BigInt(balances[asset][owner]);
  }

  function getAllowance(asset: string, owner: string, spender: string): bigint {
    if (!allowances[asset]) {
      return 0n;
    }
    if (!allowances[asset][owner]) {
      return 0n;
    }
    if (!allowances[asset][owner][spender]) {
      return 0n;
    }
    return BigInt(allowances[asset][owner][spender]);
  }

  const enoughBalance = useMemo<boolean>(() => {
    if (!auction) {
      return false;
    }
    const balance = getBalance(auction.assetOut, walletAddress);
    return balance >= auction.amountOutTotal;
  }, [walletAddress, balances, auction]);

  const enoughAllowance = useMemo<boolean>(() => {
    if (!auction) {
      return false;
    }
    const allowance = getAllowance(
      auction.assetOut,
      walletAddress,
      auction.address,
    );
    return allowance >= auction.amountOutTotal;
  }, [walletAddress, allowances, auction]);

  const [hasPendingTx, setPendingTx] = useState(false);

  async function init(): Promise<void> {
    if (!isConnected) {
      return;
    }
    if (!auction) {
      return;
    }
    await hollanderService.connect();
    setPendingTx(true);
    const blockStart = await hollanderService.init(auction.address);
    setPendingTx(false);
    if (blockStart === null) {
      return;
    }
    auction.blockStart = parseInt(blockStart.toString());
  }

  async function approve(): Promise<void> {
    if (!isConnected) {
      return;
    }
    if (!auction) {
      return;
    }
    await erc20Service.connect();
    setPendingTx(true);
    await erc20Service.approve(auction.assetOut, auction.address);
    const allowance = await erc20Service.allowance(
      auction.assetOut,
      walletAddress,
      auction.address,
    );
    setPendingTx(false);
    if (allowance !== null) {
      dispatch(
        setAllowance({
          asset: auction.assetOut,
          owner: walletAddress,
          spender: auction.address,
          value: allowance.toString(),
        }),
      );
    }
  }

  async function withdraw(): Promise<void> {
    if (!isConnected) {
      return;
    }
    if (!auction) {
      return;
    }
    await hollanderService.connect();
    setPendingTx(true);
    await hollanderService.withdraw(auction.address);
    setPendingTx(false);
    auction.amountIn = 0n;
  }

  return auction ? (
    <Page>
      <Title>
        <span>Auction</span>
        <StatusBadge
          blockStart={auction.blockStart}
          amountOut={auction.amountOut}
        />
      </Title>
      <Pair>
        <HolAsset
          showIcon
          showSymbol
          address={auction.assetOut}
        />
        →
        <HolAsset
          showIcon
          showSymbol
          address={auction.assetIn}
        />
      </Pair>
      <Params>
        <Param>
          Sell amount: {fromWei(auction.assetOut, auction.amountOut)}/
          {fromWei(auction.assetOut, auction.amountOutTotal)}
          <HolAsset
            size="s"
            showIcon
            showSymbol
            address={auction.assetOut}
          />
        </Param>
        <Param>
          Accumulated: {fromWei(auction.assetIn, auction.amountIn)}
          <HolAsset
            size="s"
            showIcon
            showSymbol
            address={auction.assetIn}
          />
        </Param>
        <Param>
          Price:{' '}
          {auctionPriceFromWei(
            auction.assetOut,
            auction.assetIn,
            auction.price,
          )}
          <HolAsset
            size="s"
            showIcon
            showSymbol
            address={auction.assetIn}
          />
        </Param>
        <Param>
          Halving period: {blocksToHours(auction.halvingPeriod)} hours
        </Param>
        <Param>Swap period: {blocksToHours(auction.swapPeriod)} hours</Param>
      </Params>
      <div>
        {status === 'draft' && enoughBalance ? (
          enoughAllowance ? (
            <HolButton
              label="Init"
              isLoading={hasPendingTx}
              onClick={init}
            />
          ) : (
            <HolButton
              label="Approve"
              isLoading={hasPendingTx}
              onClick={approve}
            />
          )
        ) : null}
        {status === 'complete' && auction.amountIn > 0n ? (
          <HolButton
            label="Withdraw"
            isLoading={hasPendingTx}
            onClick={withdraw}
          />
        ) : null}
      </div>
    </Page>
  ) : (
    <Page>Loading auction…</Page>
  );
};

export default AuctionRoute;
