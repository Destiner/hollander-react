import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from '../hooks/useAppSelector';
import EthereumService from '../services/ethereum';
import { connect as connectWallet } from '../stores/wallet';

import WalletChip from './WalletChip';
import HolButton from './_common/HolButton';

const BaseHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 24px;
  font-size: 20px;
`;

const HeaderLink = styled(Link)`
  color: var(--color-text);
  text-decoration: none;
`;

const service = new EthereumService();

const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const walletAddress = useAppSelector((state) => state.wallet.address);
  const isConnected = useMemo(() => walletAddress !== '', [walletAddress]);

  async function connect(): Promise<void> {
    const address = await service.connect();
    if (!address) {
      return;
    }
    dispatch(connectWallet(address));
  }

  return (
    <BaseHeader>
      <HeaderLink to="/">Hollander</HeaderLink>
      {isConnected ? (
        <WalletChip address={walletAddress} />
      ) : (
        <HolButton
          label="Connect"
          onClick={(): void => {
            connect();
          }}
        />
      )}
    </BaseHeader>
  );
};

export default Header;
