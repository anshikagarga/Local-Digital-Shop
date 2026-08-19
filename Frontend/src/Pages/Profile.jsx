import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../Services/api";
import { useAuth } from "../Context/AuthContext";
import "./Profile.css";

function Profile() {
    const { user, updateUser } = useAuth();

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        shopName: "",
        role: "customer",
    });

    const [passData, setPassData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPass, setChangingPass] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");
    const [passMessage, setPassMessage] = useState("");
    const [passError, setPassError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiRequest("/auth/profile");

                const data = response.data;

                setProfileData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    city: data.city || "",
                    state: data.state || "",
                    pincode: data.pincode || "",
                    shopName: data.shopName || "",
                    role: data.role || "customer",
                });

                if (updateUser) {
                    updateUser(data);
                }
            } catch (err) {
                setProfileError(
                    err?.message ||
                        "Unable to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setProfileMessage("");
        setProfileError("");
    };

    const handlePassChange = (e) => {
        const { name, value } = e.target;

        setPassData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setPassMessage("");
        setPassError("");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        setSavingProfile(true);
        setProfileMessage("");
        setProfileError("");

        try {
            const response = await apiRequest(
                "/users/profile",
                {
                    method: "PUT",
                    body: JSON.stringify(profileData),
                }
            );

            setProfileMessage(
                "Profile updated successfully!"
            );

            if (response.data && updateUser) {
                updateUser(response.data);
            }
        } catch (err) {
            setProfileError(
                err?.message ||
                    "Unable to update profile."
            );
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setChangingPass(true);
        setPassMessage("");
        setPassError("");

        if (
            passData.newPassword !==
            passData.confirmPassword
        ) {
            setPassError(
                "New password and confirm password do not match."
            );

            setChangingPass(false);

            return;
        }

        try {
            await apiRequest(
                "/users/change-password",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        currentPassword:
                            passData.currentPassword,
                        newPassword:
                            passData.newPassword,
                    }),
                }
            );

            setPassMessage(
                "Password changed successfully!"
            );

            setPassData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setPassError(
                err?.message ||
                    "Unable to change password."
            );
        } finally {
            setChangingPass(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <h2>
                    Loading profile information...
                </h2>
            </div>
        );
    }

    return (
        <main className="profile-page">

            {/* HEADER */}

            <div className="profile-header">

                <span>
                    ACCOUNT MANAGEMENT
                </span>

                <h1>
                    My Profile 👤
                </h1>

                <p>
                    Manage your account settings
                    and local seller details
                </p>

            </div>


            <div className="profile-grid">

                {/* PROFILE INFORMATION */}

                <div className="profile-card">

                    <h2>
                        Personal & Shop Details
                    </h2>


                    {profileMessage && (
                        <div className="profile-alert success">
                            ✓ {profileMessage}
                        </div>
                    )}


                    {profileError && (
                        <div className="profile-alert error">
                            ⚠️ {profileError}
                        </div>
                    )}


                    <form
                        onSubmit={
                            handleUpdateProfile
                        }
                    >

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    profileData.name
                                }
                                onChange={
                                    handleProfileChange
                                }
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    profileData.email
                                }
                                onChange={
                                    handleProfileChange
                                }
                                required
                            />

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        profileData.phone
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="Enter mobile number"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Account Role
                                </label>

                                <select
                                    name="role"
                                    value={
                                        profileData.role
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                >

                                    <option value="customer">
                                        Customer / Buyer
                                    </option>

                                    <option value="seller">
                                        Local Seller
                                    </option>

                                </select>

                            </div>

                        </div>


                        {profileData.role ===
                            "seller" && (
                            <div className="form-group">

                                <label>
                                    Shop Name
                                </label>

                                <input
                                    type="text"
                                    name="shopName"
                                    value={
                                        profileData.shopName
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="e.g. Garg Local Electronics"
                                />

                            </div>
                        )}


                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={
                                    profileData.address
                                }
                                onChange={
                                    handleProfileChange
                                }
                                placeholder="House no, street address"
                            />

                        </div>


                        <div className="form-row three-cols">

                            <div className="form-group">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={
                                        profileData.city
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="City"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={
                                        profileData.state
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="State"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={
                                        profileData.pincode
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="Pincode"
                                />

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="save-btn"
                            disabled={
                                savingProfile
                            }
                        >
                            {savingProfile
                                ? "Saving Changes..."
                                : "Save Profile Details"}
                        </button>

                    </form>

                </div>


                {/* SIDE COLUMN */}

                <div className="profile-side-column">

                    {/* CHANGE PASSWORD */}

                    <div className="profile-card">

                        <h2>
                            Change Password 🔐
                        </h2>


                        {passMessage && (
                            <div className="profile-alert success">
                                ✓ {passMessage}
                            </div>
                        )}


                        {passError && (
                            <div className="profile-alert error">
                                ⚠️ {passError}
                            </div>
                        )}


                        <form
                            onSubmit={
                                handleChangePassword
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={
                                        passData.currentPassword
                                    }
                                    onChange={
                                        handlePassChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    value={
                                        passData.newPassword
                                    }
                                    onChange={
                                        handlePassChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={
                                        passData.confirmPassword
                                    }
                                    onChange={
                                        handlePassChange
                                    }
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="pass-btn"
                                disabled={
                                    changingPass
                                }
                            >
                                {changingPass
                                    ? "Updating Password..."
                                    : "Update Password"}
                            </button>

                        </form>

                    </div>


                    {/* QUICK NAVIGATION */}

                    <div className="profile-card quick-links-card">

                        <h2>
                            Quick Navigation
                        </h2>


                        <div className="quick-links-list">

                            <Link
                                to="/orders"
                                className="quick-link"
                            >
                                📦 My Orders
                            </Link>


                            <Link
                                to="/wishlist"
                                className="quick-link"
                            >
                                ❤️ My Wishlist
                            </Link>


                            <Link
                                to="/cart"
                                className="quick-link"
                            >
                                🛒 My Shopping Cart
                            </Link>


                            {profileData.role ===
                                "seller" && (
                                <Link
                                    to="/seller/products/add"
                                    className="quick-link seller"
                                >
                                    ➕ List New Product
                                </Link>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Profile;