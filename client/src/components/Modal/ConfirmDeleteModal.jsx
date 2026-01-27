import { useState } from 'react'
import { Button, Modal } from 'antd';
import {
    DeleteOutlined
} from '@ant-design/icons';

const ConfirmDeleteModal = ({commentID}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    deleteComment(commentID)
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button onClick={showModal} icon={<DeleteOutlined />}>
      </Button>
      <Modal
        title={`ID ${commentID}`}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Are you sure you want to delete this comment?
      </Modal>
    </>
  )
}

const deleteComment = async (id) => {
  
 try {
   const response = await fetch(`http://localhost:3000/api/tickets/comments/${id}`, {
    method: "DELETE",
  })

  if(response.ok){
    console.log(`Comment with ID ${id} deleted successfully`)
    return response.status;
  }else {
    console.log(`Deletion failed`, response.statusText);
  }
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default ConfirmDeleteModal
