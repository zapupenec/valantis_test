import { useDispatch, useSelector } from 'react-redux';
import { catalogActions, catalogSelectors } from './store/slices';
import { useEffect } from 'react';
import { List } from './components';
import { useDebounce } from './hooks/use-debounce';

export const App = () => {
  const list = useSelector(catalogSelectors.selectList);
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
        [name]: value,
      }),
    );
    setPage(1)();
  };

  return (
    <>
      <List list={list} params={params} onChangeParam={handleChangeFilterField} />
    </>
  );
};
