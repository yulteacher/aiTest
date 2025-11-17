// src/context/AppDataContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useLocalDataEngine } from "../hooks/useLocalDataEngine";

const AppDataContext = createContext<ReturnType<typeof useLocalDataEngine> | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
    const data = useLocalDataEngine();
    return (
        <AppDataContext.Provider value={data}>
            {children}
        </AppDataContext.Provider>
    );
}

export const useAppDataContext = () => {
    const context = useContext(AppDataContext);
    if (!context) throw new Error("useAppDataContext must be used inside provider");
    return context;
};
