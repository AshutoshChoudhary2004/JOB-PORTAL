import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useJobPostFormStore = create(
  persist(
    (set) => ({
      title: "",
      jobType: "",
      location: "",
      companyName: "",
      introduction: "",
      responsibilities: "",
      qualifications: "",
      offers: "",
      jobNiche: "",
      salary: "",
      hiringMultipleCandidates: "",
      personalWebsiteTitle: "",
      personalWebsiteUrl: "",

      setTitle: (v) => set({ title: v }),
      setJobType: (v) => set({ jobType: v }),
      setLocation: (v) => set({ location: v }),
      setCompanyName: (v) => set({ companyName: v }),
      setIntroduction: (v) => set({ introduction: v }),
      setResponsibilities: (v) => set({ responsibilities: v }),
      setQualifications: (v) => set({ qualifications: v }),
      setOffers: (v) => set({ offers: v }),
      setJobNiche: (v) => set({ jobNiche: v }),
      setSalary: (v) => set({ salary: v }),
      setHiringMultipleCandidates: (v) => set({ hiringMultipleCandidates: v }),
      setPersonalWebsiteTitle: (v) => set({ personalWebsiteTitle: v }),
      setPersonalWebsiteUrl: (v) => set({ personalWebsiteUrl: v }),
      resetJobPostForm: () =>
        set({
          title: "",
          jobType: "",
          location: "",
          companyName: "",
          introduction: "",
          responsibilities: "",
          qualifications: "",
          offers: "",
          jobNiche: "",
          salary: "",
          hiringMultipleCandidates: "",
          personalWebsiteTitle: "",
          personalWebsiteUrl: "",
        }),
    }),
    {
      name: 'job-post-form-storage',
    }
  )
);

export default useJobPostFormStore;
