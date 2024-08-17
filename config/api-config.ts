

export const apiConfig = {

    apiAuthRoutes: "/api/auth",
    authRoutes: [
        "/login",
        "/signup",
        "/verify-otp"
    ],
    publicRoutes: [
        "/",
        "/auth/confirm-email",
        "/terms-and-conditions",
        "/privacy-policy",
        "/licenses",
        "/contact-us",
    ],
    webhookRoutes: "/api/webhooks"
}