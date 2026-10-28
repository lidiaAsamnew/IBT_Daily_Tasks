import { Component } from 'react';
import PropTypes from 'prop-types';

// Error boundaries must be class components. Catches render errors in children.
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('BookHaven UI error:', error); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="state" role="alert">
        <h1>Something went wrong</h1>
        <p>This page hit an unexpected error. Your cart and wishlist are safe.</p>
        <button className="btn" onClick={() => this.setState({ failed: false })}>Try again</button>
      </div>
    );
  }
}
ErrorBoundary.propTypes = { children: PropTypes.node };
