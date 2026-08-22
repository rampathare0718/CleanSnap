import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("fieldErrors CHANGED:", fieldErrors);
  }, [fieldErrors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError(""); // Clear global form error on input change
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

    console.log("LOGIN RESULT:", result);

    if (result?.success) {
      const role = result.user?.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "worker") navigate("/worker/dashboard");
      else navigate("/dashboard");
      return;
    }

    // Switch on the backend's error code instead of guessing from message text
    switch (result?.code) {
      case "WRONG_PASSWORD":
        setFieldErrors((prev) => ({
          ...prev,
          password: "Wrong password. Please try again.",
        }));
        break;

      case "USER_NOT_FOUND":
        setFieldErrors((prev) => ({
          ...prev,
          email: "No account found with this email.",
        }));
        break;

      case "VALIDATION_ERROR":
        setFormError(result?.message || "Please check your details and try again.");
        break;

      default:
        setFormError(result?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />

      {/* Top Left Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 font-medium text-xs sm:text-sm shadow-lg"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Main split layout */}
      <div className="relative z-10 min-h-screen w-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 py-24 lg:py-8 gap-10">
        {/* Left: Welcome message */}
        <div className="w-full lg:w-1/2 max-w-xl text-white text-center lg:text-left">
          <span className="inline-block px-3 py-1 mb-5 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm text-[11px] tracking-widest uppercase font-medium text-white/90">
            CleanSnap
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Welcome back to <br className="hidden lg:block" />
            a cleaner routine.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-white/80 font-light max-w-md mx-auto lg:mx-0">
            Sign in to manage your bookings, track your cleaners, and pick up right where you left off.
          </p>

          <div className="hidden sm:flex items-center gap-6 mt-8 justify-center lg:justify-start text-white/70 text-xs font-light">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12.75l2.25 2.25L15 9m6 3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Trusted by thousands
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure sign in
            </div>
          </div>
        </div>

        {/* Right: Login card */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-r from-red-500/70 via-orange-500/70 via-yellow-500/70 via-green-500/70 via-blue-500/70 via-indigo-500/70 to-purple-500/70 bg-[length:400%_400%] animate-rainbow backdrop-blur-2xl border border-white/40 p-8 sm:p-10 shadow-2xl text-white">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-wide">Login</h2>
              <p className="text-sm text-black/80 mt-1 font-light">
                Welcome back please login to your account
              </p>
            </div>

            {/* General Form Error Alert */}
            {formError && (
              <div className="mb-5 rounded-xl bg-red-500/30 border border-red-400/50 px-4 py-3 text-xs text-red-100 font-medium backdrop-blur-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* User Name / Email Input */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="User Email"
                    className={`w-full bg-transparent border ${
                      fieldErrors.email ? "border-red-400" : "border-white/40 focus:border-white"
                    } rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-white/60 outline-none transition-all duration-200`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                {fieldErrors.email && (
                  <span className="text-xs text-red-200 mt-1.5 block px-2 py-1 rounded-md bg-red-950/60 border border-red-500/40 font-semibold shadow-sm">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full bg-transparent border ${
                      fieldErrors.password ? "border-red-400 focus:border-red-300 ring-1 ring-red-400" : "border-white/40 focus:border-white"
                    } rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-white/60 outline-none transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 0110.122 3.937C20.268 7.943 16.478 5 12 5c-1.306 0-2.557.25-3.7.7m0 0a3 3 0 014.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Field-level red error message for wrong password */}
                {fieldErrors.password && (
                  <span className="text-xs text-red-200 mt-1.5 block px-2 py-1 rounded-md bg-red-950/60 border border-red-500/40 font-semibold shadow-sm">
                    ⚠️ {fieldErrors.password}
                  </span>
                )}
              </div>

              {/* Remember Me Checkbox + Forgot Password */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/40 bg-transparent accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-white/90 select-none cursor-pointer font-light">
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-xs text-white/90 hover:text-white font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 shadow-lg shadow-emerald-900/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-white/80 font-light">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-white hover:underline ml-1">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;