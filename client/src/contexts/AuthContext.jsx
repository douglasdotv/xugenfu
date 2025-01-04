import { createContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authErrorEventEmitter } from '../services/apiClient';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setAuth({ token, user: JSON.parse(userData) });
    }
    setLoading(false);

    const unsubscribe = authErrorEventEmitter.subscribe(() => {
      setAuth(null);
      navigate('/login', {
        replace: true,
        state: { message: 'Your session has expired. Please log in again.' },
      });
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
  };

  const contextValue = useMemo(
    () => ({ auth, login, logout, loading }),
    [auth, loading]
  );

  if (loading) return null;

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
