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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.email.trim()) errors.email = "Email is required.";
        if (!formData.password) errors.password = "Password is required.";
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

        if (result.success) {
            const role = result.user?.role;
            if (role === "admin") navigate("/admin/dashboard");
            else if (role === "worker") navigate("/worker/dashboard");
            else navigate("/dashboard");
        } else {
            setFormError(result.message);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to report issues and track your cleanups."
        >
            <form onSubmit={handleSubmit} noValidate>
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

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={fieldErrors.password}
                    required
                />

                {formError && (
                    <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
                        {formError}
                    </p>
                )}

                <Button type="submit" isLoading={isSubmitting}>
                    Log in
                </Button>
            </form>

            <p className="mt-5 text-center text-sm text-neutral-500">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
                    Create one
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;