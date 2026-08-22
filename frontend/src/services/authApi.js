import api from "./api";

// Matches: router.post("/register", registerUser)
// Expects: { fullName, email, password, mobileNumber, age, gender, address: { city, state, pincode } }
export const registerUser = async (formData) => {
    const response = await api.post("/auth/register", formData);
    return response.data; // { success, message, token, user }
};

// Matches: router.post("/login", loginUser)
// Expects: { email, password }
export const loginUser = async (formData) => {
    const response = await api.post("/auth/login", formData);
    return response.data; // { success, message, token, user }
};

// Matches: router.post("/forgot-password", forgotPassword)
// Expects: { email }
// Emails the user a password-reset link containing a secure token.
export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data; // { success, message }
};

// Matches: router.post("/reset-password/:token", resetPassword)
// Expects: { newPassword }
export const resetPassword = async ({ token, newPassword }) => {
    const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword
    });
    return response.data; // { success, message }
};