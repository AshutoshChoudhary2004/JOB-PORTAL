import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import useUserStore from '../apiStores/userStore';
const useUserApplicationFormStore = create(
  persist(
    (set) => ({
      name: '',
      email: '',
      phone: '',
      address: '',
      coverLetter: '',
      resume: '',

      setName: (name) => set({ name }),
      setEmail: (email) => set({ email }),
      setPhone: (phone) => set({ phone }),
      setAddress: (address) => set({ address }),
      setCoverLetter: (coverLetter) => set({ coverLetter }),
      setResume: (resume) => set({ resume }),
      resetUserApplicationForm: () => {
        const user = useUserStore.getState().user;
        console.log(user);
        set({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          coverLetter: user.coverLetter,
          resume: user.resume,
        })
      },
    }),
    {
      name: 'user-application-form-storage', // key in localStorage
    }
  )
);

export default useUserApplicationFormStore;
