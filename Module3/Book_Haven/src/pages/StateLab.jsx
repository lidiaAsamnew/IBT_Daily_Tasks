import { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { makeGoalStore, markRead, reset, setGoal, unmarkRead } from '../store/redux/goalStore.js';
import { useCart } from '../hooks/useCart.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useWishlist } from '../store/wishlistStore.js';

function GoalDemo() {
  const { booksPerYear, read } = useSelector((s) => s.goal);
  const dispatch = useDispatch();
  return (
    <div className="card lab">
      <h3>Redux Toolkit: reading goal</h3>
      <p>{read} of {booksPerYear} books read</p>
      <progress max={booksPerYear} value={Math.min(read, booksPerYear)} aria-label="Reading goal progress" />
      <div className="row">
        <button className="btn btn--sm" onClick={() => dispatch(markRead())}>Mark one read</button>
        <button className="btn btn--sm btn--ghost" onClick={() => dispatch(unmarkRead())}>Undo</button>
        <button className="btn btn--sm btn--ghost" onClick={() => dispatch(reset())}>Reset</button>
      </div>
      <div className="field field--inline">
        <label htmlFor="goal">Yearly goal</label>
        <input id="goal" type="number" min="1" value={booksPerYear} onChange={(e) => dispatch(setGoal(e.target.value))} />
      </div>
    </div>
  );
}

export default function StateLab() {
  useDocumentTitle('State management lab');
  const [store] = useState(makeGoalStore); // isolated store: not used by the shop
  const [clicks, setClicks] = useState(0);
  const { totals } = useCart();
  const wishCount = useWishlist((s) => s.items.length);

  return (
    <>
      <h1>State management lab</h1>
      <p className="muted">Four ways to hold state in React, with a working example of each.</p>
      <div className="grid grid--lab">
        <div className="card lab"><h3>1. Local state (useState)</h3>
          <p>Clicked {clicks} times. Only this page can see it.</p>
          <button className="btn btn--sm" onClick={() => setClicks((c) => c + 1)}>Click</button></div>
        <div className="card lab"><h3>2. Context + useReducer</h3>
          <p>The cart lives here: {totals.count} item(s) in your cart. Header, cards, cart and checkout all read it.</p></div>
        <div className="card lab"><h3>3. Zustand</h3>
          <p>The wishlist lives here: {wishCount} saved book(s). No Provider needed; components subscribe to slices.</p></div>
        <Provider store={store}><GoalDemo /></Provider>
      </div>
      <h2>When to use which</h2>
      <ul>
        <li><strong>useState</strong>: UI state owned by one component (form inputs, open/closed).</li>
        <li><strong>Context + reducer</strong>: state shared by many components with several related actions (cart).</li>
        <li><strong>Zustand</strong>: shared state with less boilerplate and built-in persistence (wishlist).</li>
        <li><strong>Redux Toolkit</strong>: large apps wanting strict action logs and DevTools time-travel. Overkill for BookHaven, so it is only demonstrated here.</li>
      </ul>
    </>
  );
}
