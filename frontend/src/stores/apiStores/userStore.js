import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const useUserStore = create((set) => ({
    name: "user",
    isAuthenticated: false,
    isAuthenticationComplete: false,
    user: {},
    loading: false,
    error: null,
    register: async (userData) => {

        set({
            loading: true,
            error: null,
            isAuthenticated: false,
            user: {},
        });
        try {
            const response = await axios.post(`${BASE_URL}/user/register`, userData, {
                withCredentials: true,
            });
            set({
                loading: false,
                error: null,
                isAuthenticated: true,
                user: response.data.user,
            });
        } catch (err) {
            console.error(err);
            set({
                loading: false,
                error: err.response?.data?.message || err.message,
                isAuthenticated: false,
                user: {},
            });
        }
    },
    login: async (userData) => {
        set({
            loading: true,
            error: null,
            isAuthenticated: false,
            user: {},
        });
        try {
            const response = await axios.post(`${BASE_URL}/user/login`, userData, {
                withCredentials: true,
            });
            set({
                loading: false,
                error: null,
                isAuthenticated: true,
                user: response.data.user,
            });
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || err.message,
                isAuthenticated: false,
                user: {},
            });
        }
    },
    logout: async () => {
        try {
            await axios.post(`${BASE_URL}/user/logout`, {}, { withCredentials: true });
            set({
                isAuthenticated: false,
                user: {},
                error: null
            });
        } catch (error) {
            set((state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                error: error.respone?.data?.message || error.message
            }));
        }
    },
    getUserDetails: async () => {
        set({
            loading: true,
            error: null,
            user: {},
        });
        try {
            const response = await axios.get(`${BASE_URL}/user/getuser`, {
                withCredentials: true,
            });
            set({
                loading: false,
                error: null,
                user: response.data.user,
            });
        } catch (err) {
            console.error(err);
            set({
                loading: false,
                error: err.response?.data?.message || err.message,
                user: {},
            });
        }
    },
     checkAuthentication : async () => {
        set({
            loading: true,
            error: null,
            isAuthenticated: false,
            user: {},
        });
        try {
            const response = await axios.get(`${BASE_URL}/user/getuser`, {
                withCredentials: true,
            });
            set({
                loading: false,
                error: null,
                isAuthenticated: true,
                user: response.data.user,
                isAuthenticationComplete: true,
            });
        } catch (err) {
            console.error(err);
            set({
                loading: false,
                error: err.response?.data?.message || err.message,
                isAuthenticated: false,
                user: {},
                isAuthenticationComplete: true,
            });
        }
    },
    clearAllUserErrors: () => set({ error: null }),

}));

export default useUserStore;