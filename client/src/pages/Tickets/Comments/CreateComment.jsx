import React from 'react'

import { useState, useContext } from 'react'
import { Button, Modal, Input } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

import UserContext from '../../../Context/UserContext';

const { TextArea } = Input;

const CreateComment = ({ticketID}) => {

  const currentUser = useContext(UserContext)
  console.log(currentUser)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    addComment(ticketID, comment, currentUser)
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleTextChange = (e) => {
    console.log(e.target.value)
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
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
      >
        <TextArea rows={4} onChange={handleTextChange}/>
      </Modal>
    </>
  )
}

const addComment = async (ticketID, comment, currentUser) => {
  let headersList = {
 "Content-Type": "application/json"
}
  let bodyContent = JSON.stringify({
    userId: currentUser.UserID,
    comment: comment
  })

 try {
    let response = await fetch(`http://localhost:3000/api/tickets/${ticketID}/comments`, {
    method: "POST",
    body: bodyContent,
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