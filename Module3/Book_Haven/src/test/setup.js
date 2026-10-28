import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

// Tests never hit the real Open Library: by default the network is "offline",
// so the app exercises its fallback path. Individual tests stub fetch as needed.
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline (test)')));
});
