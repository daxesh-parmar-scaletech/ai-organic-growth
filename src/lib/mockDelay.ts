/** Artificial latency so mock service calls behave like real network requests. */
export function mockDelay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";
