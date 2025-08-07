import { createContext, useContext, useState, ReactNode } from 'react';

interface LogoutLoadingContextType {
    isLoggingOut: boolean;
    startLogout: () => void;
    stopLogout: () => void;
}

const LogoutLoadingContext = createContext<LogoutLoadingContextType | undefined>(undefined);

export function LogoutLoadingProvider({ children }: { children: ReactNode }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const startLogout = () => setIsLoggingOut(true);
    const stopLogout = () => setIsLoggingOut(false);

    return (
        <LogoutLoadingContext.Provider value={{ isLoggingOut, startLogout, stopLogout }}>
            {children}
        </LogoutLoadingContext.Provider>
    );
}

export function useLogoutLoading() {
    const context = useContext(LogoutLoadingContext);
    if (context === undefined) {
        throw new Error('useLogoutLoading must be used within a LogoutLoadingProvider');
    }
    return context;
}
