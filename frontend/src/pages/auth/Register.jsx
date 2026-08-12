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
    const [showPassword, setShowPassword] = useState(false);

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
        
        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (!formData.password) {
            errors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }

        if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = "Passwords do not match.";
        }

        if (!formData.mobileNumber.trim()) {
            errors["mobileNumber"] = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
            errors["mobileNumber"] = "Enter a valid 10-digit mobile number.";
        }

        if (!formData.age) {
            errors.age = "Age is required.";
        } else if (Number(formData.age) < 13) {
            errors.age = "You must be at least 13 years old.";
        }

        if (!formData.gender) errors.gender = "Please select a gender.";
        if (!formData.address.city.trim()) errors["address.city"] = "City is required.";
        if (!formData.address.state.trim()) errors["address.state"] = "State is required.";
        
        if (!formData.address.pincode.trim()) {
            errors["address.pincode"] = "Pincode is required.";
        } else if (!/^\d{6}$/.test(formData.address.pincode.trim())) {
            errors["address.pincode"] = "Enter a valid 6-digit pincode.";
        }

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

        if (result?.success) {
            navigate("/dashboard");
        } else {
            setFormError(result?.message || "Registration failed. Please check your details.");
        }
    };

    return (
        <AuthLayout
            title="Create your CleanSnap account"
            subtitle="Join our community to report waste issues, clean up neighborhood spots, and earn civic points."
        >
            {/* Top Navigation Back Link */}
            <div className="mb-4">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                    ← Back to CleanSnap Home
                </Link>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
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
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    error={fieldErrors.email}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            error={fieldErrors.password}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-xs font-medium text-slate-500 hover:text-slate-800 focus:outline-none"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <Input
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        error={fieldErrors.confirmPassword}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input
                        label="Mobile Number"
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        error={fieldErrors.mobileNumber}
                        required
                    />
                    <Input
                        label="Age"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 25"
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
                    placeholder="e.g. Mumbai"
                    error={fieldErrors["address.city"]}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input
                        label="State"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="e.g. Maharashtra"
                        error={fieldErrors["address.state"]}
                        required
                    />
                    <Input
                        label="Pincode"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        error={fieldErrors["address.pincode"]}
                        required
                    />
                </div>

                {formError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[13px] text-red-700 font-medium">
                        {formError}
                    </div>
                )}

                <Button type="submit" isLoading={isSubmitting}>
                    Create Account
                </Button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
                    Log in here
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Register;