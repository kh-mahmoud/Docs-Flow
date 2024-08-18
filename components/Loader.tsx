import Image from 'next/image';
import React from 'react';

const Loader = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
         <Image
           src={"/assets/icons/loader.svg"}
           alt='loader'
           height={32}
           width={32}
           className='animate-spin'
        />
        <span className='ml-1'>Loading...</span>
    </div>
  );
}

export default Loader;
