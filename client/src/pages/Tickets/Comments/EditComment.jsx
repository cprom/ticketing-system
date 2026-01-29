import React from 'react'

import { useState, useContext } from 'react'
import { Button, Modal, Input, Tooltip } from 'antd';
import {
    EditOutlined,
} from '@ant-design/icons';

import UserContext from '../../../Context/UserContext';

const { TextArea } = Input;

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const EditComment = ({commentID, commentText}) => {

  const currentUser = useContext(UserContext)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleEdit = () => {
    updateComment(commentID, comment, currentUser)
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
     <Tooltip title="Edit comment">
         <Button onClick={showModal}  icon={<EditOutlined />}>
      </Button>
     </Tooltip>
      <Modal
        title={`Edit Comment # ${commentID}`}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleEdit}
        onCancel={handleCancel}
        okText="Update"
      >
        <TextArea rows={4} onChange={handleTextChange} defaultValue={commentText}/>
      </Modal>
    </>
  )
}

const updateComment = async (commentID, comment, currentUser) => {
  let headersList = {
 "Content-Type": "application/json"
}
  let bodyContent = JSON.stringify({
    userId: currentUser.UserID,
    comment: comment
  })

 try {
    let response = await fetch(`${apiUrl}/api/tickets/comments/${commentID}`, {
    method: "PUT",
    body: bodyContent,
    headers: headersList
  })

  if(response.ok){
    console.log(`Comment updated successfully.`)
    return response.status;
  }else {
    console.log(`Comment update failed`, response.statusText);
  }
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default EditComment