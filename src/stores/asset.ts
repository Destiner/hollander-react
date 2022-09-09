import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AssetState {
  allowances: Record<string, Record<string, Record<string, string>>>;
  balances: Record<string, Record<string, string>>;
}

const initialState: AssetState = {
  allowances: {},
  balances: {},
};

interface SetAllowancePayload {
  asset: string;
  owner: string;
  spender: string;
  value: string;
}

interface SetBalancePayload {
  asset: string;
  owner: string;
  value: string;
}

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setAllowance: (state, action: PayloadAction<SetAllowancePayload>) => {
      const { asset, owner, spender, value } = action.payload;
      if (!state.allowances[asset]) {
        state.allowances[asset] = {};
      }
      if (!state.allowances[asset][owner]) {
        state.allowances[asset][owner] = {};
      }
      state.allowances[asset][owner][spender] = value;
    },
    setBalance: (state, action: PayloadAction<SetBalancePayload>) => {
      const { asset, owner, value } = action.payload;
      if (!state.balances[asset]) {
        state.balances[asset] = {};
      }
      state.balances[asset][owner] = value;
    },
  },
});

const { setAllowance, setBalance } = assetSlice.actions;

export { initialState, assetSlice, setAllowance, setBalance };
export type { AssetState };
export default assetSlice.reducer;
