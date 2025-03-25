import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function LogIn() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);
  
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [cameFromSignup, setCameFromSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.fromSignup && location.state?.email) {
      setCameFromSignup(true);
      setOtpSent(true);
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your Email or Mobile Number.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP sent successfully!");
        setOtpSent(true);
      } else {
        alert(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("OTP sending error:", error);
      alert("Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      alert("Please request an OTP first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        navigate("/profile"); // Redirect user after successful login
      } else {
        alert(data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={logo} alt="Logo" className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email or Mobile Number
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={cameFromSignup}
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white border border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>


          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <div>
              <div className="flex items-center justify-between">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                  Enter OTP
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white border border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
              
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </>
          )}
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{' '}
          <Link to="/login/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
