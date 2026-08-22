import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setFieldError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError("Please enter a valid email address.");
      return false;
    }
    setFieldError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      // Backend always responds with success (even for unknown emails)
      // to avoid revealing which emails are registered.
      setIsSent(true);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Could not send reset link. Please try again."
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
              <h2 className="text-3xl font-bold tracking-wide">Forgot Password</h2>
              <p className="text-sm text-black/80 mt-1 font-light">
                Enter your registered email and we'll send you a link to reset your password.
              </p>
            </div>

            {formError && (
              <div className="mb-5 rounded-xl bg-red-500/20 border border-red-400/40 px-4 py-3 text-xs text-red-200 font-medium backdrop-blur-sm">
                {formError}
              </div>
            )}

            {isSent ? (
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-4 text-sm text-emerald-100 font-medium backdrop-blur-sm">
                If an account exists for <span className="font-semibold">{email}</span>, a
                password reset link has been sent. Check your inbox (and spam folder) — the
                link expires in 15 minutes.
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFieldError("");
                      }}
                      placeholder="Registered Email"
                      className={`w-full bg-transparent border ${
                        fieldError ? "border-red-400" : "border-white/40 focus:border-white"
                      } rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-white/60 outline-none transition-all duration-200`}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {fieldError && (
                    <span className="text-xs text-red-300 mt-1 block pl-1">{fieldError}</span>
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
                    "Send Reset Link"
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

export default ForgotPassword;