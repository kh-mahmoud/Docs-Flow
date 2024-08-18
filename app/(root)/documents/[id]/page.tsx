
import { WorkSapceRoom } from '@/components/Room';
import { GetDocument } from '@/lib/actions/room.actions';
import { getclerkUsers } from '@/lib/actions/user.actions';
import { SearchParamProps, User } from '@/types';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const Document = async ({ params: { id } }: SearchParamProps) => {

  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  const room = await GetDocument({ roomId: id, userId: clerkUser.emailAddresses[0].emailAddress })

  if (!room) redirect("/")

  const userIds = Object.keys(room.usersAccesses)
  const users = await getclerkUsers({userIds})


  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : 'viewer'
  }))

  const curentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer'


  return (
    <main className='flex w-full flex-col items-center'>
      <WorkSapceRoom roomId={room.id} Metadata={room.metadata} users={usersData} currentUserType={curentUserType} />
    </main>
  );
}

export default Document;
