import { useState, useContext } from 'react'
import UserContext from '../../Context/UserContext';
import {
    Form,
    Input,
    Select,
    Button
} from 'antd';
const { TextArea } = Input;


const TicketNew = () => {
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
        createNewTicket(title, description, currentUserId, assignToId, priorityId, categoryId, statusId );
    }

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
            <Form.Item onChange={handleTitleChange} label="Title">
                <Input />
            </Form.Item>
            <Form.Item label="Assign To">
                <Select onChange={handleAssignToChange} options={[{ label: 'Sys Admin', value: 4 }]} style={{width: 250}}/>
            </Form.Item>
            <Form.Item label="Priority">
                <Select onChange={handlePriorityChange} options={[{ label: 'Medium', value: 2 }]} style={{width: 250}}/>
            </Form.Item>
            <Form.Item label="Category">
                <Select onChange={handleCategoryChange} options={[{ label: 'Hardware', value: 1 }]} style={{width: 250}}/>
            </Form.Item>
            <Form.Item label="Status">
                <Select onChange={handleStatusChange} options={[{ label: 'Open', value: 1 }]} style={{width: 250}}/>
            </Form.Item>
            <Form.Item name={['introduction']} label="Description">
                <TextArea onChange={handleDescriptionChange} style={{ height: 300 }} />
            </Form.Item>
            <Form.Item label={null}>
                <Button color="default" variant="solid" onClick={handleCreateBtnClick}>
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
