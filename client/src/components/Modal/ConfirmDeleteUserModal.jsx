import { useState } from 'react'
import { useNavigate } from 'react-router';
import { Button, Modal, Tooltip } from 'antd';
import {
    DeleteOutlined
} from '@ant-design/icons';

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const ConfirmDeleteUserModal = ({userData}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const showModal = () => {
      setIsModalOpen(true);
    };
  const handleOk = () => {
    deleteUser(userData.userData.UserID)
    navigate(`/users/`)
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
     <Tooltip title={`Delete user`}>
         <Button onClick={showModal} icon={<DeleteOutlined />} type='primary' danger>
      </Button>
     </Tooltip>
      <Modal
        title={`ID ${userData.userData.UserID}`}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Are you sure you want to (hard) delete {userData.userData.FullName}?
      </Modal>
    </>
  )
}

const deleteUser = async (id) => {
 try {
   const response = await fetch(`${apiUrl}/api/users/${id}`, {
    method: "DELETE",
    credentials: 'include'
  })
  if(response.ok){
    console.log(`User with ID ${id} deleted successfully`)
    return response.status;
  }else {
    console.log(`Deletion failed`, response.statusText);
  }
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default ConfirmDeleteUserModal
