import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Button, Modal, Input, Form, Select } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

import UserContext from '../../Context/UserContext';

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const UserEdit = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();  
    const [email, setEmail] = useState();
    const [role, setRole] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [jobTitle, setJobTitle] = useState();
    const [departmentId, setDepartmentId] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [address, setAddress] = useState();
    const [managerId, setManagerId] = useState();
    const [componentSize, setComponentSize] = useState('default');
  
    const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
    };

    const handleEmailChange = (e) => {
    setEmail(e.target.value);
    }

    const handleRoleChange = (value) => {
    setRole(value)
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


    const handleUpdateBtnClick = async () => {
    try {
       updateUser(firstName, lastName, address, phoneNumber, email, role, jobTitle, departmentId,  managerId, id);
       navigate(`/user/${id}`)
    }
    catch (err){
        console.log(err);
    }
  }

      const getRolesOptions = async () => {
        const response = await fetch(`${apiUrl}/api/roles`, {
            method: "GET",
            credentials: "include"
        });
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
            const response = await fetch(`${apiUrl}/api/users`,
                {
            method: "GET",
            credentials: "include"
                }
            );
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
            const response = await fetch(`${apiUrl}/api/departments`,
                {
            method: "GET",
            credentials: "include"
                }
            );
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

    const getUserData = async (url) => {
    const response = await fetch(url, {
            method: "GET",
            credentials: "include"
    });
    return await response.json();
    }

    const {data: userEditData, error: userEditDataError} = useQuery({
        queryKey: ['userEditData', id],
        queryFn: () => getUserData(`${apiUrl}/api/users/${id}`),
        enabled: !!id
    })

    if(userDataError){
        console.log(`userEditData Fetching Error: ${userEditDataError}`)
    }

    useEffect(() => {
    if (userEditData) {
      form.setFieldsValue({
        FullName: userEditData.FullName,
        FirstName: userEditData.FirstName,
        LastName: userEditData.LastName,
        Email: userEditData.Email,
        RoleID: userEditData.RoleName,
        JobTitle: userEditData.JobTitle,
        DepartmentID: userEditData.DepartmentID,
        Phone: userEditData.PhoneNumber,
        Address: userEditData.Address,
        ProfileImg: userEditData.ProfileImg,
        ManagerID: userEditData.ManagerName
      });
    }
  }, [userEditData, form]);

  let roleOptionsParsed = [];
  data?.map((role) => roleOptionsParsed.push({label: role.RoleName, value: role.RoleID}))

  let managerOptionsParsed = [];
  userData?.map((manager) => managerOptionsParsed.push({label: manager.FullName, value: manager.UserID}))
  
  let departmentOptionsParsed = [];
  departmentData?.map((department) => departmentOptionsParsed.push({label: department.DepartmentName, value: department.DepartmentID}))

  return (
    <div>
        <h2>Edit User</h2>
         <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
            onFinish={handleUpdateBtnClick}
            form={form}
        
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
            <Form.Item name={['Email']}  label="Email" rules={[{required: false}]}>
                <Input type="email" onChange={handleEmailChange}/>
            </Form.Item>
            <Form.Item name={['RoleID']} label="Role" rules={[{required: true}]}>
                <Select onChange={handleRoleChange} options={roleOptionsParsed} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['JobTitle']} label="Job Title" rules={[{required: false}]}>
                <Input onChange={handleJobTitleChange}  />
            </Form.Item>
            <Form.Item name={['DepartmentID']} label="Department" rules={[{required: true}]}>
                <Select onChange={handleDepartmentChange} options={departmentOptionsParsed} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['ManagerID']} label="Manager" rules={[{required: false}]}>
                <Select onChange={handleManagerIdChange} options={managerOptionsParsed} style={{width: 250}}/>
            </Form.Item>
            <Form.Item label={null}>
                <Button color="default" variant="solid" htmlType='submit'>
                    Save
                </Button>
            </Form.Item>
        </Form>
    </div>
  )
}

const updateUser = async (firstName, lastName, address, phoneNumber, email, role, jobTitle, departmentId,  managerId, id) => {
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
  })

 try {
    let response = await fetch(`${apiUrl}/api/users/${id}`, {
    method: "PUT",
    body: bodyContent,
    headers: headersList,
    credentials: 'include'
  })

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update user');
  }

  // success
  return await response.json();
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default UserEdit