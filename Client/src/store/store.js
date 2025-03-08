import { create } from "zustand";

const useStore = create((set) => ({
  rank:"",
  setRank: (newRank) => set({ rank: newRank }),
  logopen: false,
  setLogopen: (newLogopen) => set({ logopen: newLogopen })
}));

export default useStore;