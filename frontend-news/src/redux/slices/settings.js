import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

// initial state
const initialState = {
  themeMode: 'system',
  colorPreset: 'default',
  direction: 'ltr',
  openSidebar: false,
  fontFamily: 'figtree',
  currency: '',
  baseCurrency: '',
  rate: 1,
  cloudName: '',
  uploadPreset: '',
  isInitialized: false
};

// slice
const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode(state, action) {
      state.themeMode = action.payload;
    },
    toggleSidebar(state) {
      state.openSidebar = !state.openSidebar;
    },
    setDirection(state, action) {
      state.direction = action.payload;
    },
    handleChangeCurrency(state, action) {
      state.currency = action.payload.currency;
      state.baseCurrency = action.payload.baseCurrency;
      state.rate = action.payload.rate;
    },

    initializeSettings: (state, action) => {
      state.cloudName = action.payload.cloudName;
      state.uploadPreset = action.payload.uploadPreset;
      state.currency = action.payload.currency;
      state.baseCurrency = action.payload.baseCurrency;
      state.rate = action.payload.rate;
      state.isInitialized = true;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setThemeMode,
  setDirection,
  toggleSidebar,
  handleChangeCurrency,

  initializeSettings
} = slice.actions;

// ----------------------------------------------------------------------
