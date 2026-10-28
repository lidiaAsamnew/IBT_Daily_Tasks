# React concept map (where to look)

| Concept | Where |
|---|---|
| JSX, components, props, `children` | `components/*`, `CartProvider` (children) |
| Default props/values, PropTypes | `SkeletonGrid` (`count = 8`), `BookCard.propTypes` |
| Conditional rendering | `BookCard` (rating only if real), `Catalog` (loading / error / empty / ready) |
| Lists and keys | `Catalog` grid (`key={b.id}`), `Cart` lines |
| Events, controlled inputs | `Catalog` filters, `Layout` search box |
| `useState` | `Layout` (menu), `BookDetails` (quantity), `StateLab` (counter) |
| Lifting state up | Catalog: filters live in the URL and flow down; `Cover` reports failure to itself only |
| `useEffect` + cleanup | `useDebounce` (timer), `useBooks` (abort), `Layout` (keydown listener) |
| `useRef` | `Layout` (focus menu button), `Checkout` (double-submit guard), `CartProvider` (timer) |
| `useContext` | `useCart` |
| `useReducer` | `CartProvider` + `cartReducer` |
| `useMemo` | `CartProvider` value, `OrderSuccess` order lookup |
| Custom hooks | `useDebounce`, `useBooks`, `useCart`, `useDocumentTitle` |
| React Router | `App` (Routes/Route/nested layout), `Layout` (`Outlet`, `NavLink`, `useNavigate`, `useLocation`), `BookDetails` (`useParams`), `Catalog` (`useSearchParams`), `*` 404 |
| Context vs Zustand | Cart = Context, wishlist = Zustand (see ARCHITECTURE.md) |
| Redux Toolkit | `store/redux/goalStore.js`, `pages/StateLab.jsx` |
| React Hook Form | `pages/Checkout.jsx`, `components/Field.jsx` |
| Error boundary | `components/ErrorBoundary.jsx` (wraps every page) |
| Lazy loading + Suspense | `App.jsx` (`lazy`), `Layout.jsx` (`Suspense`) |

Not used on purpose: `useCallback`/`memo` (no measured need). To profile, open React DevTools > Profiler, record while typing in the catalog search, and look for components re-rendering unnecessarily.
