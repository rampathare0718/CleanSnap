import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

// Shared underline-style text input for the dark card
const Field = ({ label, name, value, onChange, type = "text", placeholder, error, required, rightSlot }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-[11px] uppercase tracking-wide text-white/50 font-medium mb-1.5">
            {label}
        </label>
        <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-transparent border-b ${
                error ? "border-red-400" : "border-white/25 focus:border-emerald-400"
            } pb-2 pr-8 text-sm text-white placeholder-white/30 outline-none transition-colors duration-200`}
        />
        {rightSlot}
        {error && <span className="text-[11px] text-red-300 mt-1 block">{error}</span>}
    </div>
);

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
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
            style={{
                background:
                    "radial-gradient(circle at 20% 20%, rgba(16,60,40,0.9), rgba(3,10,7,0.98) 65%)"
            }}
        >
            {/* Outer bordered frame with tropical-leaf backdrop */}
            <div
                className="relative w-full max-w-6xl rounded-[28px] border border-emerald-900/60 overflow-hidden shadow-2xl bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1502394202744-021cfbb17454?q=80&w=1974&auto=format&fit=crop')"
                }}
            >
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10 flex flex-col lg:flex-row min-h-[720px]">
                    {/* Left: welcome / brand panel */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-14 py-14">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-emerald-300 transition-colors mb-10 w-fit"
                        >
                            ← Back to CleanSnap Home
                        </Link>
                        <span className="inline-block w-fit px-3 py-1 mb-5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] tracking-widest uppercase font-medium text-emerald-300">
                            CleanSnap
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                            Let&rsquo;s Get<br />Started
                        </h1>
                        <p className="mt-5 text-sm sm:text-base text-white/70 font-light max-w-sm">
                            Join our community to report waste issues, clean up neighborhood spots, and earn civic points.
                        </p>
                    </div>

                    {/* Right: dark form card */}
                    <div className="w-full lg:w-1/2 bg-black/55 backdrop-blur-xl px-6 sm:px-14 py-12 flex flex-col justify-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Sign up</h2>

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <Field
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                error={fieldErrors.fullName}
                                required
                            />

                            <Field
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                error={fieldErrors.email}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <Field
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min 6 characters"
                                    error={fieldErrors.password}
                                    required
                                    rightSlot={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-0 top-[30px] text-[11px] font-medium text-white/50 hover:text-white focus:outline-none"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    }
                                />

                                <Field
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <Field
                                    label="Mobile Number"
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    placeholder="10-digit number"
                                    error={fieldErrors.mobileNumber}
                                    required
                                />
                                <Field
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

                            <div>
                                <label htmlFor="gender" className="block text-[11px] uppercase tracking-wide text-white/50 font-medium mb-1.5">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`w-full bg-transparent border-b ${
                                        fieldErrors.gender ? "border-red-400" : "border-white/25 focus:border-emerald-400"
                                    } pb-2 text-sm text-white outline-none transition-colors duration-200 appearance-none`}
                                >
                                    <option className="bg-neutral-900" value="">Select gender</option>
                                    <option className="bg-neutral-900" value="Male">Male</option>
                                    <option className="bg-neutral-900" value="Female">Female</option>
                                    <option className="bg-neutral-900" value="Other">Other</option>
                                </select>
                                {fieldErrors.gender && (
                                    <span className="text-[11px] text-red-300 mt-1 block">{fieldErrors.gender}</span>
                                )}
                            </div>

                            <Field
                                label="City"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                placeholder="e.g. Mumbai"
                                error={fieldErrors["address.city"]}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <Field
                                    label="State"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    placeholder="e.g. Maharashtra"
                                    error={fieldErrors["address.state"]}
                                    required
                                />
                                <Field
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
                                <div className="rounded-lg bg-red-500/15 border border-red-400/30 px-3.5 py-2.5 text-[13px] text-red-200 font-medium">
                                    {formError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-2 py-3.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 shadow-lg shadow-emerald-900/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-white/60">
                            Already a Member?{" "}
                            <Link to="/login" className="font-semibold text-emerald-300 hover:underline">
                                Log in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom-left brand badge, echoing the reference's "presented by" pill */}
                <div className="absolute bottom-5 left-5 z-20 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-[11px] font-semibold text-slate-800 shadow-lg">
                    CleanSnap 🌿
                </div>
            </div>
        </div>
    );
};

export default Register;