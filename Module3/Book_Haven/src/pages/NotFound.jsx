import { EmptyState } from '../components/States.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return <EmptyState title="404 - Page not found" actionLabel="Go to the homepage" to="/">That page doesn&apos;t exist.</EmptyState>;
}
