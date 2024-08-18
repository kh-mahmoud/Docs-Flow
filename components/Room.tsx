"use client";

import { RoomProvider, ClientSideSuspense, } from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ActiveCollborators from "./ActiveCollborators";
import { CollaborativeRoomProps } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { UpdateDocument } from "@/lib/actions/room.actions";
import Editor from "./editor/Editor";
import ShareModal from "./ShareModal";



export function WorkSapceRoom({ roomId, Metadata, users, currentUserType }: CollaborativeRoomProps) {


    const [documentTitle, setDocumentTitle] = useState(Metadata.title)
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLoading(true)
            try {
                if (documentTitle !== Metadata.title) {
                    const updateDocument = await UpdateDocument(roomId, documentTitle)

                    if (updateDocument) {

                        setEditing(false)
                        setLoading(false)

                    }
                }

            } catch (error) {
                console.log(error)
            }
        }

    }

    useEffect(() => {
        const handleClickOutside = async (e: MouseEvent) => {
            //check if the click is inside the container or outside
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false)
                await UpdateDocument(roomId, documentTitle)

            }

        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => window.removeEventListener("mousedown", handleClickOutside)

    }, [roomId, documentTitle])

    return (
        <RoomProvider initialPresence={{ cursor: null }} id={roomId} >
            <ClientSideSuspense fallback={<Loader />}>
                <div className="w-full"  style={{ cursor: `url('/assets/Cursor.svg'), auto` }}>
                    <Header>
                        <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
                            {editing && !loading ?
                                <Input
                                    type="text"
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder="Enter title"
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disabled={!editing}
                                    className="document-title-input"
                                />
                                :

                                <p className="document-title">{documentTitle}</p>
                            }
                            {currentUserType === "editor" && !editing && (
                                <Image
                                    src={"/assets/icons/edit.svg"}
                                    width={24}
                                    height={24}
                                    alt="edit"
                                    onClick={() => setEditing(true)}
                                    className="cursor-pointer"
                                />

                            )}

                            {currentUserType != "editor" && !editing && (
                                <p className="view-only-tag">View only</p>

                            )}

                            {loading && <p className="text-sm text-gray-400">saving...</p>}
                        </div>



                        <div className="flex gap-2 items-center">
                            <ActiveCollborators />
                            <ShareModal roomId={roomId} collaborators={users} creatorId={Metadata.creatorId} currentUserType={currentUserType} />

                            <SignedOut>
                                <SignInButton />
                            </SignedOut>

                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>


                    </Header>

                    <Editor roomId={roomId} currentUserType={currentUserType} />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
}