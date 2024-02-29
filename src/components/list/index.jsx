import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import styles from './list.module.css';
import { catalogSelectors } from '../../store/slices';

export const List = ({ list, params, onChangeParam }) => {
  const error = useSelector(catalogSelectors.selectError);
  const isLoading = useSelector(catalogSelectors.selectIsLoading);
  const { page, countOnPage, filterParams } = params;

  const startIndex = page * countOnPage - countOnPage;
  const endIndex = page * countOnPage;
  const visibleItems = list.slice(startIndex, endIndex);

  return (
    <div className={styles.list}>
      <div className={clsx(styles.row, styles.header)}>
        <div className={clsx(styles.column, styles.id)}>id</div>
        <label className={clsx(styles.column, styles['filter-field'], styles.product)}>
          Название
          <input
            type="text"
            name="product"
            value={filterParams.product || ''}
            onChange={onChangeParam}
            disabled={isLoading}
          />
        </label>
        <label className={clsx(styles.column, styles['filter-field'], styles.price)}>
          Цена
          <input
            type="number"
            name="price"
            value={filterParams.price || ''}
            onChange={onChangeParam}
            disabled={isLoading}
          />
        </label>
        <label className={clsx(styles.column, styles['filter-field'], styles.brand)}>
          Бренд
          <input
            type="text"
            name="brand"
            value={filterParams.brand || ''}
            onChange={onChangeParam}
            disabled={isLoading}
          />
        </label>
      </div>
      {isLoading ? (
        <div>...Загрузка</div>
      ) : error ? (
        <div>{error}</div>
      ) : visibleItems.length === 0 ? (
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
  params: PropTypes.shape({
    page: PropTypes.number,
    countOnPage: PropTypes.number,
    filterParams: PropTypes.shape({
      brand: PropTypes.string,
      price: PropTypes.number,
      product: PropTypes.string,
    }),
  }),
  onChangeParam: PropTypes.func,
};

List.defaultProps = {
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
  onChangeParam: () => {},
};
