import { MouseEvent } from 'react';
import styled from 'styled-components';

interface Props {
  label: string;
  isLoading?: boolean;
  onClick: (event: MouseEvent) => void;
}

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  outline: none;
  background: var(--color-accent);
  color: var(--color-background);
  font-size: 14px;

  &:hover {
    background: var(--color-accent-lighter);
    cursor: pointer;
  }

  &:disabled {
    background: var(--color-accent-lighter);
    pointer-events: none;
  }
`;

const HolButton = ({
  label,
  onClick,
  isLoading = false,
}: Props): JSX.Element => {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default HolButton;
