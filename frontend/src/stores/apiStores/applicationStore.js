import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getAllApplications = async (set, role) => {
    set({
        loading: true,
        error: null,
    })
    try {
        const response = await axios.get(`${BASE_URL}/application/${role}/getall`, { withCredentials: true });
        set({
            applications: response.data.applications,
            loading: false,
            error: null
        })
    } catch (err) {
        set({
            error: err.response?.data?.message || err.message,
            loading: false
        })
    }
}
const useApplicationStore = create((set) => ({
    loading: false,
    error: null,
    success: false,
    applications: [],
    applicationDeleted: false,
    fetchEmployerApplications: async () => {
        await getAllApplications(set, "employer");
    },
    fetchJobSeekerApplications: async () => {
        await getAllApplications(set, "jobseeker");
    },
    postApplication: async (data, jobId) => {
        try {
            set({
                loading: true,
                error: null,
                success: false
            })
            await axios.post(`${BASE_URL}/application/post/${jobId}`, data, {
                withCredentials: true
            })
            set({
                loading: false,
                error: null,
                success: true
            })

        } catch (err) {
            set({
                error: err.response?.data?.message || err.message,
                loading: false,
                success: false
            })
        }
    },
    deleteApplication: async (id) => {
        try {
            set({
                loading: true,
                error: null
            })
            await axios.delete(`${BASE_URL}/application/delete/${id}`, {
                withCredentials: true
            })
            set({
                loading: false,
                error: null,
                applicationDeleted: true
            })
        } catch (err) {
            set({
                error: err.response?.data?.message || err.message,
                loading: false,
                applicationDeleted: false
            })
        }
    },
    resetApplications: async () => {
        set({
            error: null,
            loading: false,
            success: false,
            applicationDeleted: false,
        })
    }
}));

export default useApplicationStore;