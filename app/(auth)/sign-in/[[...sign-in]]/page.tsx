import { SignIn } from '@clerk/nextjs';
import React from 'react';

const page = () => {
  return (
    <div className='auth-page'>
      <SignIn  />
    </div>
  );
}

export default page;
