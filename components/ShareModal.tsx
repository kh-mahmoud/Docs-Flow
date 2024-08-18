'use client'

import { ShareDocumentDialogProps, UserType } from '@/types';
import { useSelf } from '@liveblocks/react/suspense';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,

} from "@/components/ui/dialog"
import { Button } from './ui/button';
import Image from 'next/image';
import { Label } from './ui/label';
import { Input } from './ui/input';
import UserTypeSelector from './UserTypeSelector';
import Collaborator from './Collaborator';
import { UpdateAccess } from '@/lib/actions/room.actions';


const ShareModal = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
    const user = useSelf()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")

    const [userType, setuserType] = useState<UserType>('viewer')

    const shareDocumentHandler = async () => {

        try {
            setLoading(true)
            await UpdateAccess({ roomId, email, userType, updatedBy: user.info })
            setLoading(false)

        } catch (error) {
            console.log(error)
        }

    }


    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger disabled={currentUserType !== "editor"}>
                    <Button className='gradient-blue flex h-9 gap-1 px-4' disabled={currentUserType !== "editor"}>
                        <Image
                            src={'/assets/icons/share.svg'}
                            alt='share'
                            height={20}
                            width={20}
                            className=''
                        />
                        <p className='mr-1 hidden sm:block'>Share</p>
                    </Button>
                </DialogTrigger>
                <DialogContent className='shad-dialog'>
                    <DialogHeader>
                        <DialogTitle>Manage document collaborators</DialogTitle>
                        <DialogDescription>
                            Select users  that can view and edit this document
                        </DialogDescription>
                    </DialogHeader>

                    <Label htmlFor="email" className="mt-6 text-blue-100">
                        Email address
                    </Label>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-1  items-center rounded-md bg-dark-400">
                            <Input
                                id="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="share-input"
                            />
                            <UserTypeSelector
                                userType={userType}
                                setUserType={setuserType} />

                        </div>
                        <Button type="submit" onClick={shareDocumentHandler} className="gradient-blue flex h-full gap-1 px-5" disabled={loading}>
                            {loading ? 'Sending...' : 'Invite'}
                        </Button>
                    </div>

                    <div className="my-2 space-y-2">
                        <ul className="flex flex-col">
                            {collaborators.map((collaborator) => (
                                <Collaborator
                                    key={collaborator.id}
                                    roomId={roomId}
                                    creatorId={creatorId}
                                    email={collaborator.email}
                                    collaborator={collaborator}
                                    user={user.info}
                                />
                            ))}
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default ShareModal;
