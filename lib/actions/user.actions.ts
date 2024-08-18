'use server'

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";


export const getclerkUsers = async ({userIds}: {userIds:string[]}) => {
    try {

        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds
        });


        const users = data.map((user) => ({
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.imageUrl
        }))

        const sortedusers = userIds.map((email) => users.find((user) => user.email === email))

        return parseStringify(sortedusers)


    } catch (error) {
        console.log(error)
    }



}