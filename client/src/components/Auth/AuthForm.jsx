import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/img/logo.jpg';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const AuthForm = ({ isRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // react hook for form submission

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const url = isRegister
        ? 'http://localhost:3000/api/auth/signup'
        : 'http://localhost:3000/api/auth/login';
      // fetch the api
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error(isRegister ? 'Registration failed!' : 'Login failed!');
      const result = await response.json();
      localStorage.setItem('token', result.token);
      console.log('result: ' + JSON.stringify(result));

      if (isRegister) {
        alert(`Registration successful! Welcome, ${result.data.user.username}`);
      } else {
        alert(`Login successful! Welcome back, ${result.data.user.username}`);
      }

      navigate(isRegister ? '/login' : '/');
    } catch (error) {
      console.error(error);
      alert(isRegister ? 'Registration failed!' : 'Login failed!');
    }
  };

  return (
    <div className='flex min-h-screen'>
      {/* Form Section */}
      <div className='flex-1 flex items-center justify-center bg-white p-8'>
        <div className='w-full max-w-md'>
          <div className='mb-6'>
            {isRegister ? (
              <h2 className='text-3xl font-bold text-gray-800'>
                Get Started Now
              </h2>
            ) : (
              <>
                <h2 className='text-3xl font-bold text-gray-800'>
                  Welcome back!
                </h2>
                <p>Enter your Credentials to access your account</p>
              </>
            )}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {isRegister && (
              <div>
                <label className='block mb-1 font-semibold text-gray-700'>
                  Name
                </label>
                <input
                  {...register('username', { required: 'Name is required' })}
                  type='name'
                  className='w-full p-2 border border-gray-300 rounded'
                  placeholder='Enter your name'
                />
                {errors.name && (
                  <p className='text-red-500'>{errors.name.message}</p>
                )}
              </div>
            )}

            <div>
              <label className='block mb-1 font-semibold text-gray-700'>
                Email address
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                type='email'
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='Enter your email'
              />
              {errors.email && (
                <p className='text-red-500'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className='flex justify-between'>
                <label className='block mb-1 font-semibold text-gray-700'>
                  Password
                </label>
                {isRegister === false && (
                  <span className='text-right text-blue-600 text-sm'>
                    Forget password
                  </span>
                )}
              </div>

              <input
                {...register('password', { required: 'Password is required' })}
                type='password'
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='Enter your password'
              />
              {errors.password && (
                <p className='text-red-500'>{errors.password.message}</p>
              )}
            </div>

            {isRegister && (
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  {...register('terms', {
                    required: 'You must agree to the terms and policy',
                  })}
                  className='mr-2'
                />
                <label className='text-sm text-gray-700'>
                  I agree to the{' '}
                  <a
                    href='#terms'
                    className='text-blue-500'
                  >
                    terms & policy
                  </a>
                </label>
                {errors.terms && (
                  <p className='text-red-500'>{errors.terms.message}</p>
                )}
              </div>
            )}

            <button
              type='submit'
              className='w-full bg-green-700 py-2 rounded text-white font-bold hover:bg-green-800'
            >
              {isRegister ? 'Signup' : 'Login'}
            </button>
          </form>

          <div className='flex items-center justify-center my-4'>
            <span className='border-b w-1/5 lg:w-full'></span>
            <p className='text-sm text-center mx-2 text-gray-700'>Or</p>
            <span className='border-b w-1/5 lg:w-full'></span>
          </div>

          <div className='flex justify-center items-center gap-4'>
            <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded'>
              <FcGoogle />
              Sign in with Google
            </button>
            <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded'>
              <FaApple />
              Sign in with Apple
            </button>
          </div>

          <p className='mt-4 text-gray-700 text-center'>
            {isRegister ? 'Have an account?' : "Don't have an account?"}{' '}
            <Link
              to={isRegister ? '/login' : '/register'}
              className='text-blue-500'
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div
        className='hidden md:flex md:flex-1 bg-cover bg-center'
        style={{ backgroundImage: `url(${logo})` }}
      ></div>
    </div>
  );
};

export default AuthForm;
