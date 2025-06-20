import { create } from "zustand";

export const useThemeStore = create((set) => {
  return {
    theme: localStorage.getItem("theme") || "dark",
    setTheme: async (theme) => {
      localStorage.setItem("theme", theme);
      set({ theme });
    },
  };
});
