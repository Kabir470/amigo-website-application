// Minimal stub — replaces firebase/firestore Timestamp in mock mode
export const Timestamp = {
  now: () => ({ toDate: () => new Date() }),
};
