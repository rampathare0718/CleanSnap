
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const initialState = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    age: "",
    gender: "",
    address: {
        city: "",
        state: "",
        pincode: ""
    }
};

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState(initialState);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, [key]: value }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errors = {};

        if (!formData.fullName.trim()) errors.fullName = "Full name is required.";
        if (!formData.email.trim()) errors.email = "Email is required.";
        if (!formData.password) errors.password = "Password is required.";
        else if (formData.password.length < 6)
            errors.password = "Password must be at least 6 characters.";
        if (formData.confirmPassword !== formData.password)
            errors.confirmPassword = "Passwords do not match.";
        if (!formData.mobileNumber.trim()) errors["mobileNumber"] = "Mobile number is required.";
        if (!formData.age) errors.age = "Age is required.";
        if (!formData.gender) errors.gender = "Please select a gender.";
        if (!formData.address.city.trim()) errors["address.city"] = "City is required.";
        if (!formData.address.state.trim()) errors["address.state"] = "State is required.";
        if (!formData.address.pincode.trim()) errors["address.pincode"] = "Pincode is required.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate()) return;

        const { confirmPassword, ...payload } = formData;
        payload.age = Number(payload.age);

        setIsSubmitting(true);
        const result = await register(payload);
        setIsSubmitting(false);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setFormError(result.message);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join CleanSnap and start reporting waste in your area."
        >
            <form onSubmit={handleSubmit} noValidate>
                <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    error={fieldErrors.fullName}
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    error={fieldErrors.email}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        error={fieldErrors.password}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        error={fieldErrors.confirmPassword}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Mobile Number"
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="9876543210"
                        error={fieldErrors.mobileNumber}
                        required
                    />
                    <Input
                        label="Age"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="25"
                        error={fieldErrors.age}
                        required
                    />
                </div>

                <Input
                    label="Gender"
                    name="gender"
                    as="select"
                    value={formData.gender}
                    onChange={handleChange}
                    error={fieldErrors.gender}
                    required
                >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </Input>

                <Input
                    label="City"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    error={fieldErrors["address.city"]}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="State"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        error={fieldErrors["address.state"]}
                        required
                    />
                    <Input
                        label="Pincode"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        placeholder="400001"
                        error={fieldErrors["address.pincode"]}
                        required
                    />
                </div>

                {formError && (
                    <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
                        {formError}
                    </p>
                )}

                <Button type="submit" isLoading={isSubmitting}>
                    Create account
                </Button>
            </form>

            <p className="mt-5 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Register;