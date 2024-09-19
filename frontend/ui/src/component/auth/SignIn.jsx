import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignIn = () => {
  return (
    <div className='flex-col justify-center h-screen w-screen'>
      <div className='h-1/5 pt-10 pl-10 font-bold text-2xl w-full'>
      <FontAwesomeIcon icon="fa-solid fa-arrow-left" /> Sign in your account
      </div>
      <div className='flex-col justify-center h-3/5 ml-8 mr-8 '>
        <div className='h-2/5 m-3 '> <img src="/frontend/ui/images/login-icon" alt="Not loaded successfully"></img> </div>
        <div className='border-b-2 border-gray-300 p-3 m-3' > <input type='text' name='Email' className='w-full font-bold' placeholder='Name'></input> </div>
        <div className='border-b-2 border-gray-300 p-3 m-3'> <input type='password' name='Email' className='w-full font-bold' placeholder='Password'></input> </div>
        <div className='flex items-center justify-center m-10 text-white bg-blue-500 p-3 rounded-xl text-xl font-bold'> Sign In </div>
        <div className='flex items-center justify-center ml-10 mr-10 p-3 '> Don't have an account? <span className='text-blue-500 pl-2 '> Sign Up </span> </div>
      </div>
    </div>
  )
}

export default SignIn ;