import api from "./api";

// Matches: router.put("/profile", protect, updateProfile)
// Any logged-in role (citizen, worker, admin) can update their own profile.
// payload can include any subset of: fullName, email, password, mobileNumber,
// age, gender, address ({ street, area, city, state, pincode })
export const updateMyProfile = async (payload) => {
    const response = await api.put("/users/profile", payload);
    return response.data; // { success, message, user }
};