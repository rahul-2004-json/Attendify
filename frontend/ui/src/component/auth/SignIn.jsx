import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignIn = () => {
  return (
    <div className='flex-col justify-center h-screen w-screen'>
      <div className='pb-5 pt-10 pl-10 font-bold text-2xl w-full'>
      <FontAwesomeIcon icon="fa-solid fa-arrow-left" /> Sign in your account
      </div>
      <div className='flex-col justify-center h-3/5 ml-8 mr-8 p-1 bg-blue-50 rounded-2xl border-b-2 border-blue-200'>
        <div className='flex items-center justify-center h-2/5 m-3 '> <img src="/images/image (1).png" alt="Not loaded"></img> </div>
        <div className='border-b-2 border-gray-300 p-3 m-3 ' > <input type='text' name='Email' className='w-full font-bold bg-blue-50' placeholder='Name'></input> </div>
        <div className='border-b-2 border-gray-300 p-3 m-3'> <input type='password' name='Email' className='w-full font-bold bg-blue-50' placeholder='Password'></input> </div>
        <div className='flex items-center justify-center m-10 text-white bg-blue-500 p-3 rounded-xl text-xl font-bold'> Sign In </div>
        <div className='flex items-center justify-center p-5 '> Don't have an account? <span className='text-blue-500 pl-2 '> Sign Up </span> </div>
      </div>
    </div>
  )
}

export default SignIn ;