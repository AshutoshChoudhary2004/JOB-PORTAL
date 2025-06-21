// stores/userApplicationFormStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useUserStore from '../apiStores/userStore';

const useUserUpdateFormStore = create(
  persist(
    (set) => ({
      name: "",
      email: "",
      phone: "",
      address: "",
      coverLetter: "",
      firstNiche: "",
      secondNiche: "",
      thirdNiche: "",
      resume: null,
      resumePreview: null,

      setName: (name) => set({ name }),
      setEmail: (email) => set({ email }),
      setPhone: (phone) => set({ phone }),
      setAddress: (address) => set({ address }),
      setCoverLetter: (coverLetter) => set({ coverLetter }),
      setFirstNiche: (niche) => set({ firstNiche: niche }),
      setSecondNiche: (niche) => set({ secondNiche: niche }),
      setThirdNiche: (niche) => set({ thirdNiche: niche }),
      setResume: (resume) => set({ resume }),
      setResumePreview: (resumePreview) => set({ resumePreview }),

      resetUserUpdateForm: () => {
        const user = useUserStore.getState().user;
        console.log(user);
        set({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          coverLetter: user.coverLetter,
          resume: user.resume || null,
          firstNiche: user.niches?.firstNiche || "",
          secondNiche: user.niches?.secondNiche || "",
          thirdNiche: user.niches?.thirdNiche || "",
          resumePreview: user.resume?.url || null,
        })
      }
    }),
    {
      name: "user-update-form-storage", // localStorage key
    }
  )
);

export default useUserUpdateFormStore;
