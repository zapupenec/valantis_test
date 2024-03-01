import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api';

const load = createAsyncThunk('catalog/load', async (params) => {
  const filterParams = Object.entries(params.filterParams);
  const isEmptyFilter = filterParams.every(([, { value }]) => value === null);

  let ids = [];
  if (isEmptyFilter) {
    ids = await api('get_ids');
  } else {
    ids = await api('filter', {
      ...filterParams.reduce((acc, [filterName, { value }]) => {
        if (value !== null) {
          return { ...acc, [filterName]: value };
        }
        return acc;
      }, {}),
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
  count: 1,
  params: {
    page: 1,
    limit: 50,
    filterParams: {
      product: {
        title: 'Название',
        value: null,
      },
      price: {
        title: 'Цена',
        value: null,
      },
      brand: {
        title: 'Бренд',
        value: null,
      },
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
        state.error = null;
      })
      .addCase(load.fulfilled, (state, { payload }) => {
        state.loadingStatus = 'success';
        state.list = payload.list;
        state.count = payload.list.length;
        state.params.page = 1;
      })
      .addCase(load.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
        state.params.page = 1;
      });
  },
});

export const actions = {
  ...catalogSlice.actions,
  load,
};
export const selectors = {
  selectList: (state) => state.catalog.list,
  selectCount: (state) => state.catalog.count,
  selectParams: (state) => state.catalog.params,
  selectError: (state) => state.catalog.error,
  selectLoadingStatus: (state) => state.catalog.loadingStatus,
};
export default catalogSlice.reducer;
