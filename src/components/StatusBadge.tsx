import styled from 'styled-components';

import { AuctionStatus, getStatus } from '../utils/auction';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface BadgeProps {
  status: AuctionStatus;
}

const Badge = styled.div<BadgeProps>`
  display: flex;
  align-items: center;
  padding: 2px 8px;
  border: 1px solid var(--color-text);
  border-radius: 4px;
  font-size: 12px;

  border-color: ${(props): string =>
    props.status === 'draft'
      ? '#1d86dd'
      : props.status === 'active'
      ? '#0f8c2b'
      : '#6f6f6f'};
  color: ${(props): string =>
    props.status === 'draft'
      ? '#1d86dd'
      : props.status === 'active'
      ? '#0f8c2b'
      : '#6f6f6f'};
`;

interface Props {
  blockStart: number;
  amountOut: bigint;
}

function getLabel(status: AuctionStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'active':
      return 'Active';
    case 'complete':
      return 'Complete';
  }
}

const StatusBadge = ({ blockStart, amountOut }: Props): JSX.Element => {
  const status = getStatus(blockStart, amountOut);
  const label = getLabel(status);

  return (
    <Wrapper>
      <Badge status={status}>{label}</Badge>
    </Wrapper>
  );
};

export default StatusBadge;
