import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../Services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check logged-in user when application starts
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        const loadUser = async () => {
            try {
                const response = await apiRequest("/auth/profile");

                if (response?.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("AUTH CHECK ERROR:", error);

                // Invalid / expired token
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login
    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            console.log("LOGIN RESPONSE:", response);

            // Save JWT
            if (response?.token) {
                localStorage.setItem("token", response.token);
            } else if (response?.data?.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                throw new Error("Login successful but token was not received.");
            }

            // Save user
            if (response?.user) {
                setUser(response.user);
            } else if (response?.data?.user) {
                setUser(response.data.user);
            } else if (response?.data) {
                setUser(response.data);
            }

            return response;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);

        window.dispatchEvent(
            new CustomEvent("auth:logout")
        );
    };

    // Update user after Profile update
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}