import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api';

const load = createAsyncThunk('catalog/load', async (params) => {
  const filterParams = Object.entries(params.filterParams);
  const isEmptyFilter = filterParams.every(([, value]) => value === null);

  let ids = [];
  if (isEmptyFilter) {
    ids = await api('get_ids');
  } else {
    ids = await api('filter', {
      ...Object.fromEntries(filterParams.filter(([, value]) => value !== null)),
    });
  }

  const items = await api('get_items', { ids });
  const uniqIds = [];
  const uniqItems = items.filter(({ id }) => {
    if (!uniqIds.includes(id)) {
      uniqIds.push(id);
      return true;
    }
    return false;
  });

  return { list: uniqItems };
});

const initialState = {
  list: [],
  params: {
    page: 1,
    countOnPage: 50,
    filterParams: {
      brand: null,
      price: null,
      product: null,
    },
  },
  error: null,
  loadingStatus: 'idle',
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setPage: (state, { payload }) => {
      state.params.page = payload;
    },
    setFilterParams: (state, { payload }) => {
      state.params.filterParams = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(load.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(load.fulfilled, (state, { payload }) => {
        state.loadingStatus = 'idle';
        state.list = payload.list;
      })
      .addCase(load.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const actions = {
  ...catalogSlice.actions,
  load,
};
export const selectors = {
  selectList: (state) => state.catalog.list,
  selectParams: (state) => state.catalog.params,
  selectError: (state) => state.catalog.error,
};
export default catalogSlice.reducer;
