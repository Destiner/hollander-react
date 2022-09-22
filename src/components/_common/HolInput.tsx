import { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';

interface Props {
  value: string;
  onUserInput: (value: string) => void;
  children: JSX.Element;
}

const Wrapper = styled.span`
  display: inline-flex;
  border: 1px solid var(--color-text);
  border-radius: 8px;
`;

const Input = styled.input`
  max-width: 120px;
  margin: 0;
  padding: 4px 8px;
  border: none;
  border-radius: 8px 0 0 8px;
  outline: none;
  background: #fafafa;
  font-size: 16px;
  text-align: right;
`;

const Label = styled.div`
  border-left: 1px solid var(--color-text);
  border-radius: 0 8px 8px 0;
  background: #fafafa;
  font-size: 16px;
`;

const HolInput = ({ value, onUserInput, children }: Props): JSX.Element => {
  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onUserInput(event.target.value);
    },
    [onUserInput],
  );

  return (
    <Wrapper>
      <Input
        data-testid="hol-input"
        onChange={handleInput}
        value={value}
      />
      <Label>{children}</Label>
    </Wrapper>
  );
};

export default HolInput;
