import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader, Shield } from 'lucide-react';
import API from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [accountLocked, setAccountLocked] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setAccountLocked(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/admin/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user, message } = response.data;

      // Use context to store token and user data
      login(user, token);

      setSuccessMessage('Login successful! Redirecting to admin dashboard...');

      // Redirect to admin dashboard
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      
      // Check if account is locked
      if (errorData?.message?.includes('locked')) {
        setAccountLocked(true);
        setErrorMessage(
          errorData.message || 
          'Your account is temporarily locked. Please try again later or reset your password.'
        );
      } else if (errorData?.message?.includes('verify')) {
        setErrorMessage(
          'Please verify your email first. Redirecting to verification page...'
        );
        setTimeout(() => {
          localStorage.setItem('registeredEmail', formData.email);
          navigate('/admin/verify-email');
        }, 2000);
      } else {
        setErrorMessage(
          errorData?.message || 'Login failed. Please check your credentials.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f3b7a] to-[#1e3a8a] px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-blue-100 text-sm">Sign in to your admin account</p>
          </div>

          {/* Form Container */}
          <div className="px-8 py-8">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-700 text-sm font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className={`mb-6 border-l-4 p-4 rounded ${
                accountLocked
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 ${
                    accountLocked ? 'text-orange-500' : 'text-red-500'
                  }`} />
                  <p className={`text-sm font-medium ${
                    accountLocked ? 'text-orange-700' : 'text-red-700'
                  }`}>
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${
                    errors.email
                      ? 'border-red-500 focus:border-red-600 bg-red-50'
                      : 'border-slate-200 focus:border-blue-500 bg-slate-50'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs font-medium mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/admin/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none pr-10 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                        : 'border-slate-200 focus:border-blue-500 bg-slate-50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs font-medium mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-slate-600 cursor-pointer hover:text-slate-700"
                >
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0f3b7a] to-[#1e3a8a] text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Need an account?</span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/admin/register"
              className="w-full block text-center bg-slate-100 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Admin Registration
            </Link>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Admin access only.{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Security
              </a>
            </p>
          </div>
        </div>

        {/* Legal Links */}
        <div className="text-center mt-6">
          <a href="#" className="text-white/60 hover:text-white text-xs transition-colors">
            Privacy Policy
          </a>
          <span className="text-white/30 mx-2">•</span>
          <a href="#" className="text-white/60 hover:text-white text-xs transition-colors">
            Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
