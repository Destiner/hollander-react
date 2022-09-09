import { useMemo } from 'react';
import styled from 'styled-components';

import { getIconUrl, getSymbol } from '../../utils/assets';

type Size = 's' | 'm';

interface Props {
  address: string;
  size?: Size;
  showSymbol?: boolean;
  showIcon?: boolean;
}

const AssetSymbol = styled.span``;

const Icon = styled.img`
  border: 2px solid var(--color-text);
  border-radius: 50%;
`;

const Asset = styled.div<{ size: Size }>`
  display: flex;
  gap: 8px;

  ${AssetSymbol} {
    font-size: ${(props): string => (props.size === 's' ? '16px' : '20px')};
  }

  ${Icon} {
    width: ${(props): string => (props.size === 's' ? '20px' : '24px')};
    height: ${(props): string => (props.size === 's' ? '20px' : '24px')};
  }
`;

const HolAsset = ({
  address,
  size = 'm',
  showSymbol = false,
  showIcon = false,
}: Props): JSX.Element => {
  const iconUrl = useMemo(() => getIconUrl(address), [address]);
  const symbol = useMemo(() => getSymbol(address), [address]);

  return (
    <Asset size={size}>
      {showSymbol ? <AssetSymbol>{symbol}</AssetSymbol> : null}
      {showIcon ? <Icon src={iconUrl} /> : null}
    </Asset>
  );
};

export default HolAsset;
