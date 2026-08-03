import { useEffect } from "react";
import { ThemeRegistry } from "./ThemeRegistry";

export const ChartTheme = () => {
  useEffect(() => {
    ThemeRegistry(); // ✅ ensures one-time setup
  }, []);
};