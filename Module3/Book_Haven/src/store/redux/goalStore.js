// Redux Toolkit demo only (used by /lab/state-management). Not used by the shop.
import { configureStore, createSlice } from '@reduxjs/toolkit';

const goalSlice = createSlice({
  name: 'goal',
  initialState: { booksPerYear: 12, read: 0 },
  reducers: {
    markRead: (s) => { s.read += 1; },          // Immer lets us "mutate" safely
    unmarkRead: (s) => { s.read = Math.max(0, s.read - 1); },
    setGoal: (s, a) => { s.booksPerYear = Math.max(1, Number(a.payload) || 1); },
    reset: () => ({ booksPerYear: 12, read: 0 }),
  },
});

export const { markRead, unmarkRead, setGoal, reset } = goalSlice.actions;
export const makeGoalStore = () => configureStore({ reducer: { goal: goalSlice.reducer } });
