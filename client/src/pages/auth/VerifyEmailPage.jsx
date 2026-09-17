import { ArrowLeft, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiconnector } from '../../services/apiconnector';
import { authEndpoints } from '../../services/apis';
import { setCredentials } from '../../store/slices/authSlice';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('');
    while (newCode.length < 6) newCode.push('');
    setCode(newCode);

    const nextEmpty = newCode.findIndex(c => !c);
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiconnector('POST', authEndpoints.VERIFY_EMAIL_API, {
        email,
        code: verificationCode
      });

      if (response.data.success) {
        const token = response.data?.data?.token || response.data.token;
        const user = response.data?.data?.user || response.data.user;

        // Store in localStorage
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Store auth data in Redux
        dispatch(setCredentials({
          user: user,
          token: token
        }));

        navigate('/');
      }
    } catch (error) {
      // Error is handled by api connector or displayed via toast/UI
      console.error('Email verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setResending(true);
    try {
      const response = await apiconnector('POST', authEndpoints.RESEND_CODE_API, { email });

      if (response.data.success) {
        setTimer(60);
        setCanResend(false);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      // Error is handled by api connector or displayed via toast/UI
      console.error('Resending verification code failed:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="w-full max-w-md">

        {/* Back Button */}
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-teal-600 mb-6 transition-all group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white hover:shadow-md border border-gray-200"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Sign Up</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-[fadeInUp_0.6s_ease-out]">

          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-white" size={40} />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-black text-gray-800 text-center mb-3">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-center mb-8">
            We've sent a 6-digit code to<br />
            <span className="font-semibold text-teal-600">{email}</span>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Code Inputs */}
            <div className="flex gap-3 justify-center mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 focus:outline-none transition-all hover:border-gray-400"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || code.some(d => !d)}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 mb-6 hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Verify Email
                </>
              )}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={resending ? 'animate-spin' : ''} />
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <p className="text-gray-600">
                  Resend code in <span className="font-semibold text-teal-600">{timer}s</span>
                </p>
              )}
            </div>
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={handleResendCode}
            disabled={!canResend || resending}
            className="text-teal-600 hover:underline font-semibold disabled:opacity-50"
          >
            request a new code
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
