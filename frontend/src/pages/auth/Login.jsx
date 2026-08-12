import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }
        
        if (!formData.password) {
            errors.password = "Password is required.";
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate()) return;

        setIsSubmitting(true);
        const result = await login(formData);
        setIsSubmitting(false);

        if (result?.success) {
            const role = result.user?.role;
            if (role === "admin") navigate("/admin/dashboard");
            else if (role === "worker") navigate("/worker/dashboard");
            else navigate("/dashboard");
        } else {
            setFormError(result?.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <AuthLayout
            title="Welcome back to CleanSnap"
            subtitle="Log in to report waste issues, track cleanup status, and check your rewards."
        >
            {/* Top Navigation Back Link */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                    ← Back to CleanSnap Home
                </Link>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
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

                {formError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[13px] text-red-700 font-medium">
                        {formError}
                    </div>
                )}

                <Button type="submit" isLoading={isSubmitting}>
                    Log in
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
                    Create one here
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;