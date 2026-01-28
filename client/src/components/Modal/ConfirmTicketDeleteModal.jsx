import { useState } from 'react'
import { Button, Modal, Tooltip } from 'antd';
import { useNavigate } from 'react-router';
import {
    DeleteOutlined
} from '@ant-design/icons';

const ConfirmTicketDeleteModal = ({ticketID}) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
  const handleOk = () => {
    deleteTicket(ticketID)
    navigate('/tickets');
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
     <Tooltip title="Delete Ticket" color="red" placement='bottomLeft'> <Button onClick={showModal} icon={<DeleteOutlined/>} type='primary' danger>
      </Button></Tooltip>
      <Modal
        title={`ID ${ticketID}`}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Are you sure you want to delete this ticket?
      </Modal>
    </>
  )
}

const deleteTicket = async (id) => {
 try {
   const response = await fetch(`http://localhost:3000/api/tickets/${id}`, {
    method: "DELETE",
  })
  if(response.ok){
    console.log(`Ticket with ID ${id} deleted successfully`)
    return response.status;
  }else {
    console.log(`Ticket Deletion failed`, response.statusText);
  }
 }
  catch(error){
    console.error('Network Error', error);
  }
}

export default ConfirmTicketDeleteModal
