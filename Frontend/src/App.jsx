import { useEffect } from "react";
import { apiRequest } from "./services/api";

function App() {

    useEffect(() => {

        const testAPI = async () => {

            try {

                const data =
                    await apiRequest("/products");

                console.log("Products:", data);

            } catch (error) {

                console.error(
                    "API Error:",
                    error.message
                );
            }
        };

        testAPI();

    }, []);

    return (
        <div>
            <h1>Local Digital Shop</h1>
        </div>
    );
}

export default App;