import React from 'react'
import { useQuery } from '@tanstack/react-query';

const apiUrl = import.meta.env.VITE_BASE_API_URL;

function Users() {


    const getUser = async () => {
        const response = await fetch(`${apiUrl}/api/users`);
        return await response.json();
    }

    const { data, error, isPending } = useQuery({
        queryKey: ['tickets'],
        queryFn: getUser
    });

    if(error){
        console.log(`User Fetching Error: ${error}`);
    }

    console.log(data)
  return (
    <div>
      Users
    </div>
  )
}

export default Users
