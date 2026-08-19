import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../Services/api";
import "./SellerSettings.css";

const DEFAULT_SETTINGS = {
    online: true,
    notifications: true,
    orderAlerts: true,
    emailUpdates: false,
};

function SellerSettings() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==========================================
    // LOAD SETTINGS
    // ==========================================

    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);

                const response = await apiRequest(
                    "/users/seller-settings"
                );

                setSettings({
                    ...DEFAULT_SETTINGS,
                    ...(response.data || {}),
                });
            } catch (err) {
                console.error(
                    "LOAD SETTINGS ERROR:",
                    err
                );

                setError(
                    err?.message ||
                        "Unable to load settings."
                );
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    // ==========================================
    // TOGGLE
    // ==========================================

    const handleToggle = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));

        setMessage("");
        setError("");
    };

    // ==========================================
    // SAVE SETTINGS
    // ==========================================

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const response = await apiRequest(
                "/users/seller-settings",
                {
                    method: "PUT",
                    body: JSON.stringify(settings),
                }
            );

            setSettings({
                ...DEFAULT_SETTINGS,
                ...(response.data || settings),
            });

            setMessage(
                "Settings saved successfully!"
            );
        } catch (err) {
            console.error(
                "SAVE SETTINGS ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Unable to save settings."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <main className="seller-settings-page">
                <div className="settings-loading">
                    <div className="settings-loader" />

                    <h2>
                        Loading settings...
                    </h2>

                    <p>
                        Preparing your seller
                        preferences.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="seller-settings-page">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <motion.header
                className="seller-settings-header"
                initial={{
                    opacity: 0,
                    y: -20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                }}
            >
                <div>
                    <span className="settings-eyebrow">
                        SELLER CONTROL CENTER
                    </span>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Control how your local shop
                        works and stays connected.
                    </p>
                </div>

                <motion.div
                    className="settings-header-icon"
                    whileHover={{
                        rotate: 10,
                        scale: 1.08,
                    }}
                >
                    ⚙️
                </motion.div>
            </motion.header>


            {/* ================================= */}
            {/* ALERTS */}
            {/* ================================= */}

            <AnimatePresence>

                {message && (
                    <motion.div
                        className="settings-success"
                        initial={{
                            opacity: 0,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -10,
                        }}
                    >
                        <span>✓</span>

                        {message}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        className="settings-error"
                        initial={{
                            opacity: 0,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -10,
                        }}
                    >
                        <span>!</span>

                        {error}
                    </motion.div>
                )}

            </AnimatePresence>


            {/* ================================= */}
            {/* SETTINGS */}
            {/* ================================= */}

            <section className="settings-container">


                {/* SHOP AVAILABILITY */}

                <motion.div
                    className="settings-card"
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.1,
                    }}
                >

                    <div className="settings-card-header">

                        <div className="settings-card-icon green">
                            🟢
                        </div>

                        <div>
                            <h2>
                                Shop Availability
                            </h2>

                            <p>
                                Control whether customers
                                can currently see your shop.
                            </p>
                        </div>

                    </div>


                    <div className="settings-option">

                        <div>
                            <strong>
                                Shop Online
                            </strong>

                            <span>
                                {settings.online
                                    ? "Your shop is visible to customers."
                                    : "Your shop is currently offline."}
                            </span>
                        </div>


                        <button
                            type="button"
                            className={`toggle ${
                                settings.online
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleToggle("online")
                            }
                            aria-label="Toggle shop availability"
                        >
                            <span />
                        </button>

                    </div>

                </motion.div>


                {/* NOTIFICATIONS */}

                <motion.div
                    className="settings-card"
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.2,
                    }}
                >

                    <div className="settings-card-header">

                        <div className="settings-card-icon blue">
                            🔔
                        </div>

                        <div>
                            <h2>
                                Notifications
                            </h2>

                            <p>
                                Decide which notifications
                                you want to receive.
                            </p>
                        </div>

                    </div>


                    <div className="settings-option">

                        <div>
                            <strong>
                                Push Notifications
                            </strong>

                            <span>
                                Receive important shop
                                notifications.
                            </span>
                        </div>

                        <button
                            type="button"
                            className={`toggle ${
                                settings.notifications
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleToggle(
                                    "notifications"
                                )
                            }
                            aria-label="Toggle notifications"
                        >
                            <span />
                        </button>

                    </div>


                    <div className="settings-divider" />


                    <div className="settings-option">

                        <div>
                            <strong>
                                Order Alerts
                            </strong>

                            <span>
                                Get notified when a customer
                                places an order.
                            </span>
                        </div>

                        <button
                            type="button"
                            className={`toggle ${
                                settings.orderAlerts
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleToggle(
                                    "orderAlerts"
                                )
                            }
                            aria-label="Toggle order alerts"
                        >
                            <span />
                        </button>

                    </div>


                    <div className="settings-divider" />


                    <div className="settings-option">

                        <div>
                            <strong>
                                Email Updates
                            </strong>

                            <span>
                                Receive useful product and
                                marketplace updates.
                            </span>
                        </div>

                        <button
                            type="button"
                            className={`toggle ${
                                settings.emailUpdates
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleToggle(
                                    "emailUpdates"
                                )
                            }
                            aria-label="Toggle email updates"
                        >
                            <span />
                        </button>

                    </div>

                </motion.div>


                {/* ACCOUNT STATUS */}

                <motion.div
                    className="settings-card"
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.3,
                    }}
                >

                    <div className="settings-card-header">

                        <div className="settings-card-icon purple">
                            👤
                        </div>

                        <div>
                            <h2>
                                Account Status
                            </h2>

                            <p>
                                Overview of your seller
                                account.
                            </p>
                        </div>

                    </div>


                    <div className="account-row">

                        <div>
                            <span>
                                ACCOUNT TYPE
                            </span>

                            <strong>
                                Local Seller
                            </strong>
                        </div>

                        <div className="account-badge">
                            SELLER
                        </div>

                    </div>


                    <div className="settings-divider" />


                    <div className="account-row">

                        <div>
                            <span>
                                SHOP STATUS
                            </span>

                            <strong
                                className={
                                    settings.online
                                        ? "status-dot online"
                                        : "status-dot offline"
                                }
                            >
                                ●{" "}
                                {settings.online
                                    ? "Online"
                                    : "Offline"}
                            </strong>
                        </div>

                    </div>

                </motion.div>


                {/* FOOTER */}

                <motion.div
                    className="settings-footer"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.4,
                    }}
                >

                    <p>
                        Your settings are securely
                        stored with your seller account.
                    </p>


                    <motion.button
                        type="button"
                        className="save-settings-btn"
                        onClick={handleSave}
                        disabled={saving}
                        whileHover={{
                            y: -3,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                    >

                        {saving ? (
                            <>
                                <span className="button-spinner" />
                                Saving...
                            </>
                        ) : (
                            <>
                                Save Changes
                                <span>→</span>
                            </>
                        )}

                    </motion.button>

                </motion.div>

            </section>

        </main>
    );
}

export default SellerSettings;