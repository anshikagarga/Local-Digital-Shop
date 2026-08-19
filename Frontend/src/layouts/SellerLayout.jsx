import { Outlet } from "react-router-dom";
import SellerSidebar from "../components/SellerSidebar";

function SellerLayout() {
    return (
        <div className="seller-layout">
            <SellerSidebar />

            <main className="seller-main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default SellerLayout;