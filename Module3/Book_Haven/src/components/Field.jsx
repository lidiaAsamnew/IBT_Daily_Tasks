import PropTypes from 'prop-types';

// Reusable form field wired to React Hook Form's `register`, with accessible errors.
export default function Field({ id, label, error, register, rules, as: Tag = 'input', ...rest }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Tag id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...register(id, rules)} {...rest} />
      {error && <p id={`${id}-err`} className="field__err" role="alert">Error: {error.message}</p>}
    </div>
  );
}
Field.propTypes = {
  id: PropTypes.string.isRequired, label: PropTypes.string.isRequired, error: PropTypes.object,
  register: PropTypes.func.isRequired, rules: PropTypes.object, as: PropTypes.string,
};
