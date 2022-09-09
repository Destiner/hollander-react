import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface WalletState {
  address: string;
}

const initialState: WalletState = {
  address: '',
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    disconnect: (state) => {
      state.address = '';
    },
  },
});

const { connect, disconnect } = walletSlice.actions;

export { initialState, walletSlice, connect, disconnect };
export type { WalletState };
export default walletSlice.reducer;
