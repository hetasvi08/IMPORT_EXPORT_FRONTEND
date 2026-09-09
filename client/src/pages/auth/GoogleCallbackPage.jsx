import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        dispatch(setCredentials({ user, token }));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigate to unified dashboard
        navigate('/dashboard');
      } catch {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-semibold">Completing authentication...</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
