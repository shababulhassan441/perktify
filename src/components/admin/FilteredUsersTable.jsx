import React from 'react'
import UsersTable from './UsersTable'
import { fetchAllUsers } from '@/lib/data';
import { cookies } from 'next/headers';

const FilteredUsersTable = async({filters}) => {
    cookies();
    const userList = await fetchAllUsers(filters);

  return (
    <UsersTable users={userList} />
  )
}

export default FilteredUsersTable