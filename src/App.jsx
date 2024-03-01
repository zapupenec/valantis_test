import { useDispatch, useSelector } from 'react-redux';
import { catalogActions, catalogSelectors } from './store/slices';
import { useEffect } from 'react';
import { List, Pagination } from './components';
import { useDebounce } from './hooks/use-debounce';

export const App = () => {
  const list = useSelector(catalogSelectors.selectList);
  const count = useSelector(catalogSelectors.selectCount);
  const params = useSelector(catalogSelectors.selectParams);

  const dispatch = useDispatch();
  const loadList = useDebounce(() => dispatch(catalogActions.load(params)), 1000);

  useEffect(() => {
    loadList();
  }, [params.filterParams]);

  const setPage = (pageNum) => () => dispatch(catalogActions.setPage(pageNum));

  const handleChangeFilterField = (e) => {
    let { name, type, value } = e.target;

    if (value === '') {
      value = null;
    }

    if (value !== null && type === 'number') {
      value = Number(value);
    }

    dispatch(
      catalogActions.setFilterParams({
        ...params.filterParams,
        [name]: {
          ...params.filterParams[name],
          value,
        },
      }),
    );
  };

  return (
    <>
      <Pagination page={params.page} count={count} limit={params.limit} handleClick={setPage} />
      <List list={list} params={params} count={count} onChangeParam={handleChangeFilterField} />
    </>
  );
};
