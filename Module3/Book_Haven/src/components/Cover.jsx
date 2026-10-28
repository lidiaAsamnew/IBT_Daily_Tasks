import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Cover({ book, large = false }) {
  const src = large ? book.coverImage || book.thumbnail : book.thumbnail;
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) {
    return (
      <div className="cover cover--ph" role="img" aria-label={`No cover available for ${book.title}`}>
        <span>{book.title}</span>
      </div>
    );
  }
  return <img className="cover" src={src} alt={`Cover of ${book.title}`} loading="lazy" onError={() => setFailed(true)} />;
}
Cover.propTypes = { book: PropTypes.object.isRequired, large: PropTypes.bool };
