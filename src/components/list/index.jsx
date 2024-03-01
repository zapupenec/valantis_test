import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import styles from './list.module.css';
import { catalogSelectors } from '../../store/slices';
import { FilterField } from './filter-field';

export const List = ({ list, count, params, onChangeParam }) => {
  const error = useSelector(catalogSelectors.selectError);
  const loadingStatus = useSelector(catalogSelectors.selectLoadingStatus);
  const { page, limit, filterParams } = params;

  const startIndex = page * limit - limit;
  const endIndex = page * limit;
  const visibleItems = list.slice(startIndex, endIndex);

  return (
    <div className={styles.list}>
      <div className={clsx(styles.row, styles.header)}>
        <div className={clsx(styles.column, styles.id)}>id</div>
        {Object.entries(filterParams).map(([filterName, { title, value }]) => (
          <FilterField
            key={filterName}
            className={clsx(styles.column, styles[filterName])}
            title={title}
            type="text"
            name={filterName}
            value={value || ''}
            onChange={onChangeParam}
            disabled={loadingStatus === 'loading'}
          />
        ))}
      </div>
      {loadingStatus === 'loading' ? (
        <div>...Загрузка</div>
      ) : loadingStatus === 'error' ? (
        <div>{error}</div>
      ) : loadingStatus === 'success' && count === 0 ? (
        <div>По данном запросу ничего не найдено</div>
      ) : (
        visibleItems.map((item) => (
          <div className={styles.row} key={item.id}>
            <div className={clsx(styles.column, styles.id)}>{item.id}</div>
            <div className={clsx(styles.column, styles.product)}>{item.product}</div>
            <div className={clsx(styles.column, styles.price)}>{item.price}</div>
            <div className={clsx(styles.column, styles.brand)}>{item.brand}</div>
          </div>
        ))
      )}
    </div>
  );
};

List.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      brand: PropTypes.string,
      product: PropTypes.string,
      price: PropTypes.number,
    }),
  ),
  count: PropTypes.number,
  params: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    filterParams: PropTypes.shape({
      brand: PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.string,
      }),
      price: PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.string,
      }),
      product: PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.string,
      }),
    }),
  }),
  onChangeParam: PropTypes.func,
};

List.defaultProps = {
  list: [],
  count: 0,
  params: {
    page: 1,
    limit: 50,
    filterParams: {
      brand: null,
      price: null,
      product: null,
    },
  },
  onChangeParam: () => {},
};
