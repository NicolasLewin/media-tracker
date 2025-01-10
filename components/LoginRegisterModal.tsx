import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type LoginRegisterModalProps = {
  onClose: () => void;
}

export const LoginRegisterModal = ({ onClose }: LoginRegisterModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser } = useUser();

  const router = useRouter();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/user/verify-token', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.isLoggedIn) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!isLogin && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const endpoint = isLogin ? '/api/user/login' : '/api/user/register';
      const bodyData = isLogin 
        ? { email, password }
        : { username, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        if (isLogin) {
          setUser(data.user);

          router.refresh();

          setMessage(`Hello, ${data.user.username}!`);
          onClose();
          toast.success("Successfully logged in!");

        } else {
          setMessage('Registration successful! Please log in.');
          setIsLogin(true);
        }
      } else {
        setMessage(data.message || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } catch (error) {
      console.error(isLogin ? 'Login error:' : 'Registration error:', error);
      setMessage(`An error occurred during ${isLogin ? 'login' : 'registration'}`);
    }
  };

  const inputClassName = "mt-1 block w-full px-3 py-2 text-lg bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-100 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        {message && (
          <div className={`mb-4 p-2 rounded ${message.includes('successful') || message.includes('Hello') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                className={inputClassName}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={inputClassName}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={inputClassName}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={inputClassName}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-300 text-gray-800 py-3 px-4 rounded-md text-lg font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};