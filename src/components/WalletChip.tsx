import jazzicon from '@metamask/jazzicon';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useAppDispatch } from '../hooks/useAppSelector';
import { disconnect } from '../stores/wallet';
import { formatAddress } from '../utils/formatters';

const Chip = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px;
  border: 2px solid var(--color-text);
  border-radius: 8px;
  font-size: 14px;
`;

const Icon = styled.div`
  height: 20px;
`;

const IconCross = styled.span`
  cursor: pointer;
`;

interface Props {
  address: string;
}

const WalletChip = ({ address }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const iconEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!iconEl.current) {
      return;
    }
    iconEl.current.innerHTML = '';
    iconEl.current.appendChild(
      jazzicon(20, parseInt(address.slice(2, 10), 16)),
    );
  }, [address]);

  return (
    <Chip>
      <Icon ref={iconEl} />
      {formatAddress(address)}
      <IconCross onClick={(): void => dispatch(disconnect())}>X</IconCross>
    </Chip>
  );
};

export default WalletChip;
