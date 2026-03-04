import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Button, Modal, Input, Form, Select } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';


const apiUrl = import.meta.env.VITE_BASE_API_URL;

const UserNew = () => {
    const navigate = useNavigate();  
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [managerId, setManagerId] = useState('');
    const [componentSize, setComponentSize] = useState('default');
    const [emailExist, setEmailExist] = useState(false);
    const [ferror, setFError] = useState(null);

    const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
    };

    const handleEmailChange = (e) => {
    setEmail(e.target.value);
    }

    const handleRoleChange = (value) => {
    setRole(value)
    }

    const handlePasswordChange = (e) => {
    setPasswordHash(e.target.value);
    }

    const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    }
    
    const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    }

    const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
    }

    const handleDepartmentChange = (value) => {
    setDepartmentId(value);
    }

    const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    }

    const handleAddressChange = (e) => {
    setAddress(e.target.value);
    }

    const handleManagerIdChange = (value) => {
    setManagerId(value);
    }


    const handleCreateBtnClick = async () => {
    try {
        const result = await CreateNewUser(firstName, lastName, address, phoneNumber, email, role, jobTitle, departmentId,  managerId,  passwordHash, setEmailExist);
        handleFirebaseSignUp()
        navigate(`/user/${result.userId}`)
    }
    catch (err){
        console.log(err);
    }
  }

      const getRolesOptions = async () => {
        const response = await fetch(`${apiUrl}/api/roles`);
        const results = await response.json();
        return results
    }

    const { data, error } = useQuery({
        queryKey: ['roles'],
        queryFn: getRolesOptions
    });

    if(error){
        console.log(`Roles Fetching Error: ${error}`);
    }

        const getUser = async () => {
            const response = await fetch(`${apiUrl}/api/users`);
            const results = await response.json();
            return results
        }
    
        const { data:userData, error:userDataError } = useQuery({
            queryKey: ['users'],
            queryFn: getUser
        });
    
        if(error){
            console.log(`User Fetching Error: ${userDataError}`);
        }

        const getDepartments = async () => {
            const response = await fetch(`${apiUrl}/api/departments`);
            const results = await response.json();
            return results
        }
    
        const { data:departmentData, error:departmentDataError } = useQuery({
            queryKey: ['departments'],
            queryFn: getDepartments
        });
    
        if(error){
            console.log(`User Fetching Error: ${departmentDataError}`);
        }




  let roleOptionsParsed = [];
  data?.map((role) => roleOptionsParsed.push({label: role.RoleName, value: role.RoleID}))

  let managerOptionsParsed = [];
  userData?.map((manager) => managerOptionsParsed.push({label: manager.FullName, value: manager.UserID}))
  
  let departmentOptionsParsed = [];
  departmentData?.map((department) => departmentOptionsParsed.push({label: department.DepartmentName, value: department.DepartmentID}))

  
// Create user in Firebase

    const handleFirebaseSignUp = async () => {
    setFError(null); // Clear previous errors

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, passwordHash);
      // Signed up successfully
      const user = userCredential.user;
      console.log("User created:", user);
      // You can redirect the user or update UI state here
    } catch (error) {
      // Handle Errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign up error:", errorCode, errorMessage);
      setFError(errorMessage);
    }
  };


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
            <Form.Item name={['FirstName']} label="First Name" rules={[{required: true}]}>
                <Input onChange={handleFirstNameChange}  />
            </Form.Item>
            <Form.Item name={['LastName']} label="Last Name" rules={[{required: true}]}>
                <Input onChange={handleLastNameChange}  />
            </Form.Item>
            <Form.Item name={['Address']} label="Address" rules={[{required: false}]}>
                <Input onChange={handleAddressChange}  />
            </Form.Item>
            <Form.Item name={['Phone']} label="Phone" rules={[{required: false}]}>
                <Input onChange={handlePhoneNumberChange}  />
            </Form.Item>
            <Form.Item label="Email">
                <Input type="email" onChange={handleEmailChange}/>
                <span>{emailExist ? <span style={{color: 'red'}}>Email Aleardy exist.</span> : ''}</span>
            </Form.Item>
            <Form.Item name={['Role']} label="Role" rules={[{required: true}]}>
                <Select onChange={handleRoleChange} options={roleOptionsParsed} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['JobTitle']} label="Job Title" rules={[{required: false}]}>
                <Input onChange={handleJobTitleChange}  />
            </Form.Item>
            <Form.Item name={['Department']} label="Department" rules={[{required: true}]}>
                <Select onChange={handleDepartmentChange} options={departmentOptionsParsed} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['Manager']} label="Manager" rules={[{required: false}]}>
                <Select onChange={handleManagerIdChange} options={managerOptionsParsed} style={{width: 250}}/>
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

const CreateNewUser = async (firstName, lastName, address, phoneNumber, email, role, jobTitle, departmentId,  managerId,  passwordHash,  setEmailExist) => {
  let headersList = {
 "Content-Type": "application/json"
}
  let bodyContent = JSON.stringify({
    name: `${firstName} ${lastName}`,
    firstName: firstName,
    lastName: lastName,
    address: address,
    phoneNumber: phoneNumber,
    email: email,
    roleId: role,
    jobTitle: jobTitle,
    departmentId: departmentId,
    managerId: managerId,
    passwordHash: passwordHash,
  })

 try {
    let response = await fetch(`${apiUrl}/api/users`, {
    method: "POST",
    body: bodyContent,
    headers: headersList
  })

if (!response.ok) {
    if (response.status === 409 ) {
      setEmailExist(true);
      return;
    }
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create user');
  }

  // success
  return await response.json();
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default UserNew