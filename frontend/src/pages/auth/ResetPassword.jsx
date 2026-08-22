import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};

    if (!newPassword) errors.newPassword = "New password is required.";
    else if (newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters.";

    if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== newPassword) errors.confirmPassword = "Passwords do not match.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!token) {
      setFormError("This reset link is invalid. Please request a new one.");
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await resetPassword({ token, newPassword });
      setSuccessMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired. Please request a new one."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />

      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/login"
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
          Back to Login
        </Link>
      </div>

      <div className="relative z-10 min-h-screen w-full flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="relative z-10 w-full rounded-3xl bg-gradient-to-r from-red-500/70 via-orange-500/70 via-yellow-500/70 via-green-500/70 via-blue-500/70 via-indigo-500/70 to-purple-500/70 bg-[length:400%_400%] animate-rainbow backdrop-blur-2xl border border-white/40 p-8 sm:p-10 shadow-2xl text-white">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-wide">Reset Password</h2>
              <p className="text-sm text-black/80 mt-1 font-light">
                Enter a new password for your account.
              </p>
            </div>

            {formError && (
              <div className="mb-5 rounded-xl bg-red-500/20 border border-red-400/40 px-4 py-3 text-xs text-red-200 font-medium backdrop-blur-sm">
                {formError}
              </div>
            )}

            {successMessage && (
              <div className="mb-5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-xs text-emerald-100 font-medium backdrop-blur-sm">
                {successMessage}
              </div>
            )}

            {!successMessage && (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* New Password */}
                <div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
                    }}
                    placeholder="New Password"
                    className={`w-full bg-transparent border ${
                      fieldErrors.newPassword ? "border-red-400" : "border-white/40 focus:border-white"
                    } rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/60 outline-none transition-all duration-200`}
                  />
                  {fieldErrors.newPassword && (
                    <span className="text-xs text-red-300 mt-1 block pl-1">{fieldErrors.newPassword}</span>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    placeholder="Confirm New Password"
                    className={`w-full bg-transparent border ${
                      fieldErrors.confirmPassword ? "border-red-400" : "border-white/40 focus:border-white"
                    } rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/60 outline-none transition-all duration-200`}
                  />
                  {fieldErrors.confirmPassword && (
                    <span className="text-xs text-red-300 mt-1 block pl-1">{fieldErrors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 shadow-lg shadow-emerald-900/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-white/80 font-light">
              Remembered your password?{" "}
              <Link to="/login" className="font-semibold text-white hover:underline ml-1">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;