import PropTypes from 'prop-types';
import clsx from 'clsx';

import styles from './filter-field.module.css';

export const FilterField = ({ className, title, type, name, value, onChange, disabled }) => {
  return (
    <label className={clsx(className, styles['filter-field'])}>
      {title}
      <input type={type} name={name} value={value} onChange={onChange} disabled={disabled} />
    </label>
  );
};

FilterField.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number']),
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

FilterField.defaultProps = {
  className: '',
  title: '',
  type: 'text',
  name: '',
  value: '',
  onChange: () => {},
  disabled: false,
};
