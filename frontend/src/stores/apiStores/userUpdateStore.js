import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const useUserUpdateStore = create((set) => ({
    error: null,
    loading: false,
    isUpdated: false,
    updateUser: async (userData) => {
        set({
            loading: true,
            error: null,
            isUpdated: false,
        });
        try {
            await axios.put(`${BASE_URL}/user/update/profile`, userData, {
                withCredentials: true,
            });
            set({
                loading: false,
                error: null,
                isUpdated: true,
            });
        } catch (err) {
            console.error(err);
            set({
                loading: false,
                error: err.response?.data?.message || err.message,
                isUpdated: false,
            });
        }
    },
    clearAllUpdateUserErrors: () => {
        set({
            error: null,
            isUpdated: false,
            loading: false,
        });
    },
    updatePassword: async (userData) => {
        set({
            loading: true,
            error: null,
            isUpdated: false,
        });
        try {
            await axios.put(`${BASE_URL}/user/update/password`, userData, {
                withCredentials: true,
            });
            set({
                loading: false,
                error: null,
                isUpdated: true,
            });
        } catch (err) {
            console.error(err);
            set({
                loading: false,
                error: err.response?.data?.message || err.message,
                isUpdated: false,
            });
        }
    }
}));
export default useUserUpdateStore;