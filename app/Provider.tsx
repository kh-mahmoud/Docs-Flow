"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getclerkUsers } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { GetDocumentUsers } from "@/lib/actions/room.actions";



export function Provider({ children }: { children: ReactNode }) {

    const {user} = useUser()

    

    return (
        <LiveblocksProvider
        //check users permission and create session with user infos
            authEndpoint={"/api/liveblocks-auth"}

        //provide a list of the room users like  users in the thread component
            resolveUsers={async ({ userIds }) => {
                const users = await getclerkUsers({ userIds });

                return users;
            }}
        //provide the room users for mention users
            resolveMentionSuggestions={async ({ text, roomId }) => {
              
                const rommUsers= await GetDocumentUsers({roomId,currentUser:user?.emailAddresses[0].emailAddress!,text})

                return rommUsers
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    );
}