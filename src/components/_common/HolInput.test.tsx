import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import HolInput from './HolInput';

describe('input component', () => {
  describe('initially empty', () => {
    it('keypress handling', async () => {
      let inputValue = '';
      render(
        <HolInput
          value={inputValue}
          onUserInput={(value): void => {
            inputValue = value;
          }}
        >
          <span>label</span>
        </HolInput>,
      );

      const element = screen.getByTestId('hol-input');

      element.focus();

      await userEvent.type(element, 'a');

      expect(inputValue).toEqual('a');
    });
  });

  describe('initially non-empty', () => {
    it('keypress handling', async () => {
      let inputValue = 'abc';
      render(
        <HolInput
          value={inputValue}
          onUserInput={(value): void => {
            inputValue = value;
          }}
        >
          <span>label</span>
        </HolInput>,
      );

      const element = screen.getByTestId('hol-input');

      element.focus();

      await userEvent.type(element, 'd');

      expect(inputValue).toEqual('abcd');
    });
  });
});
