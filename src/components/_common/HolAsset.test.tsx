import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import { USDC_TESTNET_ADDRESS } from '../../utils/assets';

import HolAsset from './HolAsset';

describe('asset component', () => {
  it('symbol only', () => {
    render(
      <HolAsset
        address={USDC_TESTNET_ADDRESS}
        showSymbol
      />,
    );

    const element = screen.getByTestId('hol-asset');

    expect(element.children.length).toEqual(1);
    expect(screen.getByTestId('hol-asset').children[0]).toHaveTextContent(
      'USDC',
    );
  });

  it('icon only', () => {
    render(
      <HolAsset
        address={USDC_TESTNET_ADDRESS}
        showIcon
      />,
    );

    const element = screen.getByTestId('hol-asset');

    expect(element.children.length).toEqual(1);
    expect(screen.getByTestId('hol-asset').children[0]).toHaveAttribute('src');
  });

  it('symbol and icon asset', () => {
    render(
      <HolAsset
        address={USDC_TESTNET_ADDRESS}
        showSymbol
        showIcon
      />,
    );

    const element = screen.getByTestId('hol-asset');

    expect(element.children.length).toEqual(2);
    expect(screen.getByTestId('hol-asset').children[0]).toHaveTextContent(
      'USDC',
    );
    expect(screen.getByTestId('hol-asset').children[1]).toHaveAttribute('src');
  });

  it('small size', () => {
    render(
      <HolAsset
        address={USDC_TESTNET_ADDRESS}
        showSymbol
        size="s"
      />,
    );

    const element = screen.getByTestId('hol-asset');

    expect(element.children.length).toEqual(1);
  });
});
