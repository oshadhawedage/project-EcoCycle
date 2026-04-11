import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import API, { setAuthToken } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
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
      const response = await API.post('/users/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user, message } = response.data;

      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role); // Store role for later use

      setSuccessMessage('Login successful! Redirecting to dashboard...');

      // Redirect based on user role
      setTimeout(() => {
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.role === 'RECYCLER') {
          navigate('/recycler/dashboard');
        } else {
          navigate('/user/dashboard');
        }
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
          navigate('/verify-email');
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex items-center justify-center px-4 py-12">
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Side - Content & Benefits */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700 p-12 text-white">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-300 to-cyan-300 rounded-lg"></div>
                </div>
                <h2 className="text-2xl font-bold">EcoCycle</h2>
              </div>
              
              <h3 className="text-4xl font-bold leading-tight mb-6">
                Welcome Back, Eco Warrior
              </h3>
              
              <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
                Continue your mission to reduce e-waste and make a positive environmental impact with our community.
              </p>

              {/* Benefits List */}
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">View Your Impact</h4>
                    <p className="text-emerald-100 text-sm">See your e-waste recycling progress and achievements</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Manage Pickups</h4>
                    <p className="text-emerald-100 text-sm">Schedule and track your e-waste pickups easily</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Check Rewards</h4>
                    <p className="text-emerald-100 text-sm">Access your earned points and special benefits</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Community Connect</h4>
                    <p className="text-emerald-100 text-sm">Stay connected with fellow eco-conscious members</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <p className="text-sm text-emerald-100">Active Users</p>
              </div>
              <div>
                <div className="text-2xl font-bold">5K+</div>
                <p className="text-sm text-emerald-100">E-waste Recycled</p>
              </div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-sm text-emerald-100">Eco-Friendly</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your EcoCycle account</p>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className={`mb-6 p-4 border rounded-lg ${
                accountLocked
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  accountLocked ? 'text-orange-800' : 'text-red-800'
                }`}>
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    errors.email
                      ? 'border-red-300 bg-red-50 focus:ring-red-500 text-gray-900'
                      : 'border-emerald-300 bg-white focus:ring-emerald-500 text-gray-900 border-opacity-50'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs font-medium mt-1.5">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
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
                    className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 pr-10 ${
                      errors.password
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 text-gray-900'
                        : 'border-emerald-300 bg-white focus:ring-emerald-500 text-gray-900 border-opacity-50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs font-medium mt-1.5">{errors.password}</p>
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
                  className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-600 cursor-pointer hover:text-gray-700"
                >
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors mt-8 text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Create Account Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>
                By signing in, you agree to our{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Terms of Service
                </a>
                {' and '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
