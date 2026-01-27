import React from 'react'
import { useQuery } from '@tanstack/react-query';

function Profile() {


    const getUser = async () => {
        const response = await fetch(`http://localhost:3000/api/users`);
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
      Profile
    </div>
  )
}

export default Profile
