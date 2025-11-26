import { create } from "zustand";

export type TeamType = {
  _id: string;
  name: string;
  creator: string;
  operator: string;
  members: string[];
};

type TeamStoreType = {
  teams: TeamType[];
  loading: boolean;
  error: string | null;
  getTeams: () => Promise<void>;
};

const useTeams = create<TeamStoreType>((set) => ({
  teams: [],
  loading: false,
  error: null,

  getTeams: async () => {
    try {
      set({ loading: true });

      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");

      const data = await res.json();

      set({ teams: data.teams, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useTeams;
