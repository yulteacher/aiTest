// src/context/AppDataContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useAppData } from "../hooks/useAppData";

const AppDataContext = createContext<ReturnType<typeof useAppData> | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
    const data = useAppData();
    return <AppDataContext.Provider value={data}>{children}</AppDataContext.Provider>;
}

export const useAppDataContext = () => {
    const context = useContext(AppDataContext);
    if (!context) throw new Error("useAppDataContext must be used within an AppDataProvider");
    return context;
};
