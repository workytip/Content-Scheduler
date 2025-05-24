import { FaSpinner } from 'react-icons/fa';

const Spinner = ({ className = '' }) => (
  <FaSpinner className={`animate-spin ${className}`} />
);

export default Spinner;