import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/job';

const useJobStore = create((set) => ({
  jobs: [],
  loading: false,
  error: null,
  singleJob: {},
  myJobs: [],
  jobPosted: false,
  jobDeleted: false,


  setLoading: (val = true) => set({ loading: val, error: null }),

  fetchJobs: async (city, niche, searchKeyword = "") => {
    set({ loading: true, error: null });
    const params = new URLSearchParams();
    if (searchKeyword) params.append("searchKeyword", searchKeyword);
    if (city && city !== "All") params.append("city", city);
    if (niche && niche !== "All") params.append("niche", niche);
    try {
      const { data } = await axios.get(`${BASE_URL}/getall?${params}`, { withCredentials: true });
      set({ jobs: data.jobs, loading: false });
    } catch (err) {

      set({ jobs: [], loading: false, error: err?.response?.data?.message || err.message });
    }
  },

  fetchSingleJob: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${BASE_URL}/get/${jobId}`, { withCredentials: true });
      set({ singleJob: data.job, loading: false });
    } catch (err) {
      console.log("printing error msg:", err.response.data.message);
      set({ loading: false, error: err.response?.data?.message || err.message });
    }
  },

  postJob: async (jobData) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${BASE_URL}/post`, jobData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      set({ loading: false, jobPosted: true });
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.message || err.message });
    }
  },

  getMyJobs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${BASE_URL}/getmyjobs`, { withCredentials: true });
      set({ myJobs: data.myJobs, loading: false });
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.message || err.message });
    }
  },

  deleteJob: async (id) => {
    set({ jobDeleted: false, loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`, { withCredentials: true });
      set({ jobDeleted: true, loading: false });
    } catch (err) {
      set({ jobDeleted: false, loading: false, error: err?.response?.data?.message || err.message });
    }
  },

  resetJobStoreState: () => set({
    loading: false,
    error: null,
    singleJob: {},
    jobPosted: false,
    jobDeleted: false,
  }),
}));

export default useJobStore;

