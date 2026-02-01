import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Button, Modal, Input, Form, Select } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

import UserContext from '../../Context/UserContext';

const UserNew = () => {
    const navigate = useNavigate();  
    const currentUser = useContext(UserContext)
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [componentSize, setComponentSize] = useState('default');


    const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
    };

    const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    }

    const handleEmailChange = (e) => {
    setEmail(e.target.value);
    }

    const handleRoleChange = (value) => {
    setRole(value)
    }

    const handlePasswordChange = (e) => {
    setPasswordHash(e.target.value);
    }

    const handleCreateBtnClick = async () => {
    try {
        const result = await CreateNewUser(userName, email, passwordHash, role);
        navigate(`/user/${result.userId}`)
    }
    catch (err){
        console.log(err);
    }
  }

  const roleOptions = [
    {
        RoleID: 1,
        RoleName: 'Admin'
    },
    {
        RoleID: 2,
        RoleName: 'Agent'
    },
    {
        RoleID: 3,
        RoleName: 'User'
    },
  ]

  let roleOptionsParsed = [];
  roleOptions?.map((role) => roleOptionsParsed.push({label: role.RoleName, value: role.RoleID}))

  return (
    <div>
        <h2>Create New User</h2>
         <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
            onFinish={handleCreateBtnClick}
        
        >
            <Form.Item name={['FullName']} label="Full Name" rules={[{required: true}]}>
                <Input onChange={handleUserNameChange}  />
            </Form.Item>
            <Form.Item label="Email">
                <Input type="email" onChange={handleEmailChange}/>
            </Form.Item>
            <Form.Item name={['Role']} label="Role" rules={[{required: true}]}>
                <Select onChange={handleRoleChange} options={roleOptionsParsed} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['PasswordHash']} label="Password" rules={[{required: true}]}>
                <Input onChange={handlePasswordChange}  />
            </Form.Item>
            <Form.Item label={null}>
                <Button color="default" variant="solid" htmlType='submit'>
                    Create
                </Button>
            </Form.Item>
        </Form>
    </div>
  )
}

const CreateNewUser = async (userName, email, passwordHash, role) => {
  let headersList = {
 "Content-Type": "application/json"
}
  let bodyContent = JSON.stringify({
    name: userName,
    email: email,
    passwordHash: passwordHash,
    roleId: role
  })

 try {
    let response = await fetch(`http://localhost:3000/api/users`, {
    method: "POST",
    body: bodyContent,
    headers: headersList
  })

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create ticket');
  }

  // success
  return await response.json();
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default UserNew