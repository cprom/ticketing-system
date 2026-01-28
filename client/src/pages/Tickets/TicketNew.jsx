import { useState, useContext } from 'react'
import UserContext from '../../Context/UserContext';
import {
    Form,
    Input,
    Select,
    Button
} from 'antd';
import { useNavigate } from 'react-router';
const { TextArea } = Input;

import { useQuery } from "@tanstack/react-query";


const TicketNew = () => {
    const navigate = useNavigate();
    const currentUser = useContext(UserContext)
    const [componentSize, setComponentSize] = useState('default');
    const [title, setTitle] = useState();
    const [assignToId, setAssignToId] = useState();
    const [priorityId, setPriorityId] = useState();
    const [categoryId, setCategoryId] = useState();
    const [statusId, setStatusId] = useState();
    const [description, setDescription] = useState();

    const currentUserId = currentUser.UserID;

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }
    const handleAssignToChange = (value) => {
        setAssignToId(value)
    }
    const handlePriorityChange = (value) => {
        setPriorityId(value)
    }
    const handleCategoryChange = (value) => {
        setCategoryId(value)
    }
    const handleStatusChange = (value) => {
        setStatusId(value)
    }
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleCreateBtnClick = () => {
        createNewTicket(title, description, currentUserId, assignToId, priorityId, categoryId, statusId);
        navigate('/tickets');
    }

    const getData = async (url) => {
    const response = await fetch(url);
    return await response.json();
    }

      // Assign To
    const { data: userData, error: userDataError } = useQuery({
        queryKey: ['users'],
        queryFn: () => getData(`http://localhost:3000/api/users`)
    });

    if(userDataError){
        console.log(`UserData Fetching Error: ${userDataError}`);
    }
    
    let assignOptions = [];
    userData?.map((tech) => assignOptions.push({label: tech.FullName, value: tech.UserID}))

    // Priority
    const { data: priorityData, error: priorityDataError } = useQuery({
        queryKey: ['priorities'],
        queryFn: () => getData('http://localhost:3000/api/priorities')
    })
    
        if(priorityDataError){
        console.log(`priorityData Fetching Error: ${priorityDataError}`);
    }

    let priorityOptions = [];
        priorityData?.map((priority) => priorityOptions.push({label: priority.PriorityName, value: priority.PriorityID}))

    // Category
    const { data: categoryData, error: categoryDataError } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getData('http://localhost:3000/api/categories')
    })
    
        if(categoryDataError){
        console.log(`categoryData Fetching Error: ${categoryDataError}`);
    }

    let categoryOptions = [];
        categoryData?.map((category) => categoryOptions.push({label: category.CategoryName, value: category.CategoryID}))

    // Statuses
        const { data: statusData, error: statusDataError } = useQuery({
        queryKey: ['statuses'],
        queryFn: () => getData('http://localhost:3000/api/`statuses`')
    })
    
        if(statusDataError){
        console.log(`statusData Fetching Error: ${statusDataError}`);
    }

    let statusOptions = [];
        statusData?.map((status) => statusOptions.push({label: status.StatusName, value: status.StatusID}))


  return (
    <div>
      <h2>Create New Ticket</h2>
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
        
        >
            <Form.Item name={['Title']} label="Title" rules={[{required: true, message: 'Title is required'}]}>
                <Input onChange={handleTitleChange}  />
            </Form.Item>
            <Form.Item label="Assign To">
                <Select onChange={handleAssignToChange} options={assignOptions} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['Priority']} label="Priority" rules={[{required: true}]}>
                <Select onChange={handlePriorityChange} options={priorityOptions} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['Category']} label="Category" rules={[{required: true}]}>
                <Select onChange={handleCategoryChange} options={categoryOptions} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['Status']} label="Status" rules={[{required: true}]}>
                <Select onChange={handleStatusChange} options={statusOptions} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['Description']} label="Description" rules={[{required: true}]}>
                <TextArea onChange={handleDescriptionChange} style={{ height: 300 }} />
            </Form.Item>
            <Form.Item label={null}>
                <Button color="default" variant="solid" onClick={handleCreateBtnClick} htmlType='submit'>
                    Create
                </Button>
            </Form.Item>
        </Form>
    </div>
  )
}

const createNewTicket = async (title, description, currentUserId, assignToId, priorityId, categoryId, statusId ) => {
  let headersList = {
 "Content-Type": "application/json"
}
  let bodyContent = JSON.stringify({
    title: title,
    description: description,
    createdBy: currentUserId,
    assignedTo: assignToId,
    priorityId: priorityId,
    categoryId: categoryId,
    statusId: statusId
  })

 try {
    let response = await fetch(`http://localhost:3000/api/tickets/`, {
    method: "POST",
    body: bodyContent,
    headers: headersList
  })

  if(response.ok){
    console.log(`New ticket added successfully.`)
    return response.status;
  }else {
    console.log(`New Ticket creation failed`, response.statusText);
  }
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default TicketNew
