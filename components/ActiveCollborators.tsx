import { useOthers, useSelf } from '@liveblocks/react/suspense';
import Image from 'next/image';
import React from 'react';

const ActiveCollborators = () => {

    const others = useOthers();
    const currentUser = useSelf();


    const collaborators = others.map((other) => other.info)

    return (
        <div>
            <ul className='flex -space-x-4'>
                {collaborators.slice(0, 3).map(({ id, avatar, name, color }) =>

                    <li key={id}>
                        <Image
                            src={avatar}
                            alt={name}
                            height={40}
                            width={40}
                            className='rounded-full ring-2 ring-dark-100'
                            style={{ border: `3px solid ${color}` }}
                        />
                    </li>


                )}

                {currentUser && (
                    <div className="relative ml-8 first:ml-0">
                        <Image
                            src={currentUser.info.avatar}
                            alt={currentUser.info.name}
                            height={40}
                            width={40}
                            className='rounded-full ring-2 ring-dark-100'
                            style={{ border: `3px solid ${currentUser.info.color}` }}
                        />
                    </div>
                )}


            </ul>
        </div>
    );
}

export default ActiveCollborators;
