import api from "./api";

export const rewardApi = {
  // Citizen — own reward history + running total points
  getMy: async (params = {}) => {
    const { data } = await api.get("/rewards/my", { params });
    return data;
  },

  // Citizen + Admin — top N citizens by points
  getLeaderboard: async (limit = 10) => {
    const { data } = await api.get("/rewards/leaderboard", { params: { limit } });
    return data;
  },

  // Admin — all reward entries, optionally filtered by user
  getAll: async (params = {}) => {
    const { data } = await api.get("/rewards", { params });
    return data;
  },

  // Admin — one user's full reward summary
  getUserSummary: async (userId) => {
    const { data } = await api.get(`/rewards/user/${userId}`);
    return data;
  },

  // Admin — delete/correct a reward entry
  remove: async (id) => {
    const { data } = await api.delete(`/rewards/${id}`);
    return data;
  },

  // Admin — end current cycle, declare winner, reset all points
  endCycle: async () => {
    const { data } = await api.post("/rewards/end-cycle");
    return data;
  },
};