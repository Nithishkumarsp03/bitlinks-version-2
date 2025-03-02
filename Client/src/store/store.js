import { create } from "zustand";

const useStore = create((set) => ({
  rank:"",
  setRank: (newRank) => set({ rank: newRank }),
}));

export default useStore;