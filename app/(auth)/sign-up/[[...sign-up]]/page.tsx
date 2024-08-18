import { SignUp } from '@clerk/nextjs';
import React from 'react';

const page = () => {
  return (
    <div className='auth-page'>
      <SignUp />
    </div>
  );
}

export default page;
