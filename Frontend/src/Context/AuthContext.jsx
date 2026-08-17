import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

import { apiRequest } from "../Services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial session restore from localStorage token
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await apiRequest("/auth/profile");
                    setUser(response.data);
                } catch (error) {
                    console.error("Session restore error:", error);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {

        setLoading(true);

        try {

            const response = await apiRequest(
                "/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            setUser(response.data.user);

            return response;

        } catch (error) {

            throw error;

        } finally {

            setLoading(false);
        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);
    };

    const updateUser = (userData) => {
        setUser((prev) => ({ ...prev, ...userData }));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    return useContext(AuthContext);
};