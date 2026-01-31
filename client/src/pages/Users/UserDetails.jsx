import { useState } from 'react';
import { useParams } from 'react-router';

const UserDetails = () => {
    const { id } = useParams();

  return (
    <div>
      Details
      {id}
    </div>
  )
}

export default UserDetails
