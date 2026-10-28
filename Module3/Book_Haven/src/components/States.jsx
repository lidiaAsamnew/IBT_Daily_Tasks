import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid" role="status" aria-label="Loading books">
      {Array.from({ length: count }, (_, i) => <div key={i} className="card skeleton" aria-hidden="true" />)}
    </div>
  );
}
SkeletonGrid.propTypes = { count: PropTypes.number };

export function EmptyState({ title, children, actionLabel, onAction, to }) {
  return (
    <div className="state">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {to && <Link className="btn" to={to}>{actionLabel}</Link>}
      {onAction && <button className="btn" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
EmptyState.propTypes = {
  title: PropTypes.string.isRequired, children: PropTypes.node,
  actionLabel: PropTypes.string, onAction: PropTypes.func, to: PropTypes.string,
};

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="state" role="alert">
      <h2>We couldn&apos;t load this</h2>
      <p>{message}</p>
      {onRetry && <button className="btn" onClick={onRetry}>Retry</button>}
    </div>
  );
}
ErrorBox.propTypes = { message: PropTypes.string.isRequired, onRetry: PropTypes.func };
