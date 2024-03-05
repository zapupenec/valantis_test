import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api';

const loadIds = createAsyncThunk('catalog/loadIds', async (params) => {
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

  return { ids: [...new Set(ids)] };
});

const loadItems = createAsyncThunk('catalog/loadItems', async ({ ids, params }) => {
  const { page, limit } = params;
  const startIndex = page * limit - limit;
  const endIndex = page * limit;
  const items = await api('get_items', { ids: ids.slice(startIndex, endIndex) });

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
  ids: [],
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
      .addCase(loadIds.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(loadIds.fulfilled, (state, { payload }) => {
        state.ids = payload.ids;
        state.count = payload.ids.length;
        state.params.page = 1;
      })
      .addCase(loadIds.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
        state.params.page = 1;
      })
      .addCase(loadItems.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(loadItems.fulfilled, (state, { payload }) => {
        state.list = payload.list;
        state.loadingStatus = 'success';
      })
      .addCase(loadItems.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
        state.params.page = 1;
      });
  },
});

export const actions = {
  ...catalogSlice.actions,
  loadIds,
  loadItems,
};
export const selectors = {
  selectIds: (state) => state.catalog.ids,
  selectList: (state) => state.catalog.list,
  selectCount: (state) => state.catalog.count,
  selectParams: (state) => state.catalog.params,
  selectError: (state) => state.catalog.error,
  selectLoadingStatus: (state) => state.catalog.loadingStatus,
};
export default catalogSlice.reducer;
