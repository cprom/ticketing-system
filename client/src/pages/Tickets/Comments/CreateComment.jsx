import React from 'react'

import { useState, useContext } from 'react'
import { Button, Modal, Input } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

import UserContext from '../../../Context/UserContext';

const { TextArea } = Input;

const CreateComment = ({ticketID}) => {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const currentUser = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    addComment(apiUrl, ticketID, comment, currentUser)
    window.location.reload(false);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleTextChange = (e) => {
    setComment(e.target.value);
  }
  return (
    <>
      <Button onClick={showModal} shape='circle' icon={<PlusOutlined />}>
      </Button>
      <Modal
        title={`Add Comment for ticket # ${ticketID}`}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={handleCancel}
        okText="Add"
      >
        <TextArea rows={4} onChange={handleTextChange}/>
      </Modal>
    </>
  )
}

const addComment = async (apiUrl, ticketID, comment, currentUser) => {
  let headersList = {
 "Content-Type": "application/json"
}
  let bodyContent = JSON.stringify({
    userId: currentUser.userId,
    comment: comment
  })

 try {
    let response = await fetch(`${apiUrl}/api/tickets/${ticketID}/comments`, {
    method: "POST",
    body: bodyContent,
    credentials: 'include',
    headers: headersList
  })

  if(response.ok){
    console.log(`Comment added successfully.`)
    return response.status;
  }else {
    console.log(`Comment creation failed`, response.statusText);
  }
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default CreateComment