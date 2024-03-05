import PropTypes from 'prop-types';
import styles from './pagination.module.css';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { catalogSelectors } from '../../store/slices';

export const Pagination = ({ page, limit, count, indent, handleClick }) => {
  const pageCount = Math.ceil(count / Math.max(limit, 1));
  const loadingStatus = useSelector(catalogSelectors.selectLoadingStatus);

  let left = Math.max(page - indent, 1);
  const right = Math.min(left + indent * 2, pageCount);
  left = Math.max(right - indent * 2, 1);

  const items = [];

  if (left > 1) {
    items.push(1);
  }

  if (left > 2) {
    items.push(null);
  }

  for (let page = left; page <= right; page++) {
    items.push(page);
  }

  if (right < pageCount - 1) {
    items.push(null);
  }

  if (right < pageCount) {
    items.push(pageCount);
  }

  return (
    <ul className={styles.pagination}>
      {items.map((number, index) => (
        <li
          key={index}
          className={clsx(styles['pagination-item'], {
            [styles.active]: number === page,
            [styles.split]: !number,
            [styles.disabled]: number && loadingStatus !== 'success',
          })}
          onClick={handleClick(number)}
        >
          <button disabled={number && loadingStatus !== 'success'}>
            {number ? number : '...'}
          </button>
        </li>
      ))}
    </ul>
  );
};

Pagination.propTypes = {
  page: PropTypes.number,
  limit: PropTypes.number,
  count: PropTypes.number,
  indent: PropTypes.number,
  handleClick: PropTypes.func,
};

Pagination.defaultProps = {
  page: 1,
  limit: 50,
  count: 50,
  indent: 1,
  handleClick: () => {},
};
