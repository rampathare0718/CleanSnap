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