'use client'


import { AddDocumentBtnProps } from '@/types';
import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { CreateDocument } from '@/lib/actions/room.actions';
import { useRouter } from 'next/navigation';

const AddBtn = ({ userId, email }: AddDocumentBtnProps) => {

    const router= useRouter()

    const addDocumentHandler = async () => {
        try {
            const room = await CreateDocument({userId,email})
            if(room) router.push(`/documents/${room.id}`)
         } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Button type='submit' onClick={addDocumentHandler} className='flex gap- shadow-md gradient-blue'>
                <Image
                    src={"/assets/icons/add.svg"}
                    alt='add'
                    width={24}
                    height={24}
                />
                <p className='hidden sm:block'>Add a blank document</p>
            </Button>
        </div>
    );
}

export default AddBtn;
