import {
    createContext,
    useContext,
    useState,
} from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(false);

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

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    return useContext(AuthContext);
};