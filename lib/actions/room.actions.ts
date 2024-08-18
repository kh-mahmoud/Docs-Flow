'use server'

import { AccessType, CreateDocumentParams, RoomAccesses, ShareDocumentParams } from "@/types"
import { v4 as uuidv4 } from 'uuid';
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";


export const CreateDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = uuidv4()

    try {

        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled'
        }

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"]
        }

        const room = await liveblocks.createRoom(roomId, {
            defaultAccesses: [],
            metadata,
            usersAccesses
        });

        revalidatePath('/')

        return parseStringify(room)

    } catch (error) {
        console.log(`error while creating a room ${error}`)
    }


}


export const GetDocument = async ({ roomId, userId }: { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)

        const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        if (!hasAccess) redirect("/")

        return parseStringify(room)

    } catch (error) {
        console.log(error)
    }

}


export const UpdateDocument = async (roomId: string, title: string) => {
    try {
        const updateroom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            },
        });

        revalidatePath(`/documents/${roomId}`)


        return parseStringify(updateroom)

    } catch (error) {
        console.log(error)
    }

}


export const GetDocuments = async (email: string) => {
    try {
        const { data } = await liveblocks.getRooms({ userId: email })

        return parseStringify(data)

    } catch (error) {
        console.log(error)
    }

}


export const GetDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {

    try {
        const room = await liveblocks.getRoom(roomId)

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser)

        if (text.length) {
            const lowerCaseText = text.toLowerCase()

            const filtredUsers = users.filter((email) => email.toLowerCase().includes(lowerCaseText))

            return parseStringify(filtredUsers)
        }

        return parseStringify(users)

    } catch (error) {

    }

}


export const UpdateAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    try {

        const room = await liveblocks.getRoom(roomId)
        const users = Object.keys(room.usersAccesses)

        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType
        }

        const Updatedroom = await liveblocks.updateRoom(roomId, {
            usersAccesses
        })

        if (Updatedroom) {
            const notificationId = uuidv4()

            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: "$documentAccess",
                subjectId: notificationId,
                activityData: {
                    title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
                    avatar:updatedBy.avatar,
                    email:updatedBy.email

                },
                roomId,

            })


        }

        revalidatePath(`/documents/${roomId}`)

        return parseStringify(Updatedroom)

    } catch (error) {
        console.log(error)
    }


}



export const RemoveCollaborator = async ({ roomId, email }: { roomId: string, email: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)

        if (room.metadata.email === email) {
            throw new Error('you cannot remove your self from the document ')
        }

        const updateRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null
            }
        })


        revalidatePath(`/documents/${roomId}`)

        return parseStringify(updateRoom)

    } catch (error) {
        console.log(error)
    }


}


export const DeleteDocument = async (roomId: string) => {
    try {
        await liveblocks.deleteRoom(roomId);
        revalidatePath('/');
        redirect('/');
    } catch (error) {
        console.log(`Error happened while deleting a room: ${error}`);
    }
}
