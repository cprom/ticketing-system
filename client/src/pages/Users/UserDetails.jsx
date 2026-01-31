import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Card, Spin, Image } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import avatar from '../../assets/img/avatar.jpg'

import { useParams } from 'react-router';
const { Meta } = Card;
const apiUrl = import.meta.env.VITE_BASE_API_URL;

const UserDetails = () => {
    const { id } = useParams();

    const getUserInfo = async () => {
        const response = await fetch(`${apiUrl}/api/users/${id}`);
        return await response.json();
    }

    const {data: userData, error, isPending } = useQuery({
        queryKey: ['user', id],
        queryFn: getUserInfo
    })

    if(error){
        console.log(`User Fetching error ${error}`);
    }

  return (
    <div>
        { isPending ? <Spin size='large'/>
    :
    <div>
        <Image
            alt="user photo"
            style={{borderRadius: '50%', width: 100, height: 100, border: '1px solid black', margin: 20}}
            src={avatar}
        />
            <Card
               style={{height: 300}} 
            >
            <h3>User Details</h3>
            <div>
                <span style={{fontWeight: 'bold'}}>ID:</span> {userData && userData.UserID}
            </div>
            <div>
                <span style={{fontWeight: 'bold'}}>Display Name:</span> {userData && userData.FullName}
            </div>
            <div>
                <span style={{fontWeight: 'bold'}}>Email:</span> {userData &&  userData.Email}
            </div>
            <div><span style={{fontWeight: 'bold'}}>Role: </span> 
                {userData && 
                userData.RoleID == 1 ? "Admin"
                :
                userData.RoleID == 2 ? "Agent"
                : 
                userData.RoleID == 3 ? "User"
                :
                ""
                }
            </div>


        </Card>   
    </div>
    }
    </div>
  )
}

export default UserDetails
