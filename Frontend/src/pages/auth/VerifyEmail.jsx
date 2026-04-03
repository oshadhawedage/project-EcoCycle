import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, Loader, Clock } from 'lucide-react';
import API from '../../services/api';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Get email from localStorage if available
    const registeredEmail = localStorage.getItem('registeredEmail');
    if (registeredEmail) {
      setEmail(registeredEmail);
    }
  }, []);

  // Timer for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Concatenate OTP
  const otpValue = otp.join('');

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (otpValue.length !== 6) {
      setErrorMessage('Please enter all 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/users/verify-email', {
        email,
        otp: otpValue,
      });

      setSuccessMessage('Email verified successfully! Redirecting to login...');
      
      // Clear stored email
      localStorage.removeItem('registeredEmail');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || 'OTP verification failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setResendLoading(true);

    try {
      await API.post('/users/resend-otp', { email });
      
      setSuccessMessage('New OTP sent to your email!');
      setOtp(['', '', '', '', '', '']);
      setResendTimer(60); // 60 seconds timer
      
      // Auto-focus first OTP input
      document.getElementById('otp-0')?.focus();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setErrorMessage(message);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Verification Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
            <p className="text-blue-100 text-sm">Enter the 6-digit code sent to your email</p>
          </div>

          {/* Form Container */}
          <div className="px-8 py-8">
            {/* Email Display */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              {email ? (
                <>
                  <p className="text-xs text-slate-600 font-medium">Verification code sent to</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{email}</p>
                  <button
                    onClick={() => setEmail('')}
                    className="text-xs text-blue-600 hover:text-blue-700 mt-2"
                  >
                    Change email
                  </button>
                </>
              ) : (
                <>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Enter Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 bg-slate-50 focus:outline-none"
                  />
                </>
              )}
            </div>

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
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* OTP Input Fields */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Verification Code
                </label>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || otpValue.length !== 6}
                className="w-full bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            {/* Resend Section */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 text-center mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendLoading || resendTimer > 0}
                className="w-full py-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resendLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : resendTimer > 0 ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Resend in {resendTimer}s
                  </>
                ) : (
                  'Resend Code'
                )}
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-500 text-center mt-4">
              If you don't see the email, check your spam folder or try requesting a new code.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Need help?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
