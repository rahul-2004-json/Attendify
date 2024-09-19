import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignIn = () => {
  return (
    <div className='flex-col justify-center h-screen w-screen'>
      <div className='h-1/5 pt-10 pl-10 font-bold text-2xl'>
      <FontAwesomeIcon icon="fa-solid fa-arrow-left" /> Sign in your account
      </div>
      <div className='flex-col justify-center h-3/5 ml-8 mr-8 '>
        <div className='h-2/5'> Div1 </div>
        <div> <input type='text' name='Email'></input> </div>
        <div>  </div>
        <div> Div4 </div>
        <div> Div5 </div>
      </div>
    </div>
  )
}

export default SignIn ;