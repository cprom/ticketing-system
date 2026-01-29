import { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Spin, Flex, Tooltip, Modal } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import Badge from "antd/es/badge/Badge";
import ConfirmDeleteModal from "../../components/Modal/ConfirmDeleteModal";
import CreateComment from "./Comments/CreateComment";
import ConfirmTicketDeleteModal from "../../components/Modal/ConfirmTicketDeleteModal";
import EditComment from "./Comments/EditComment";

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const TicketDetails = () => {

    const { id } = useParams();
    const [show, setShow] = useState(true);

    const getTickets = async () => {
    const response = await fetch(`${apiUrl}/api/tickets/${id}`);
    return await response.json();
    }

    const { data, error, isPending } = useQuery({
        queryKey: ['tickets', id],
        queryFn: getTickets
    });

    if(error){
        console.log(`Ticket Fetching Error: ${error}`);
    }

    const getComments = async () => {
        const response = await fetch(`${apiUrl}/api/tickets/${id}/comments`);
        return await response.json();
    }

    const {data: commentData , error: commentError } = useQuery({
        queryKey: ['comments', id],
        queryFn: getComments
    })
    if(commentError){
        console.log(`Comment Fetching Error: ${commentError}`);
    }

  return (
    <div>
        {
        isPending ?
        <Spin size="large" className="spinner-container"/> 
         : 
        <div className="ticket-container">
            <div style={{display: 'flex', gap: '15px'}}>
                <h2>Ticket # {data.TicketID}</h2>
                <div style={{marginTop: '17.43px'}}>
                { data.StatusName === 'Open' ? <Badge count={show ? 'Open' : 0} showZero color="#00be43ff" /> 
                : data.StatusName === 'Closed' ? <Badge count={show ? 'Closed' : 0} showZero color="#fb3737ff" /> 
                : data.StatusName === 'Resolved' ? <Badge count={show ? 'Resolved' : 0} showZero color="#ff8800ff" /> 
                : data.StatusName === 'In Progress' ? <Badge count={show ? 'In Progress' : 0} showZero color="#ffe600ff" style={{color: 'black'}} /> 
                : ""}
                </div>
                <div style={{marginTop: '17.43px'}}>
                    {
                  data.PriorityName === 'Low' ? <Badge count={show ? 'Low' : 0} showZero color="#ebebebff" style={{color: 'black'}}/> 
                : data.PriorityName === 'Medium' ? <Badge count={show ? 'Medium' : 0} showZero color="#ffe600ff" style={{color: 'black'}}/> 
                : data.PriorityName === 'High' ? <Badge count={show ? 'High' : 0} showZero color="#ff8800ff" /> 
                : data.PriorityName === 'Critical' ? <Badge count={show ? 'Critical' : 0} showZero color="#ff0000ff" /> 
                : ""
                    }
                </div>
                <div style={{display: 'flex', gap: 10}}>
                    <h4>Assigned To: </h4>
                    <p style={{marginTop: '18.62px'}}>{data.AssignedToName ? data.AssignedToName : "unassigned"}</p>
                </div>
                 <div style={{display: 'flex', gap: 10}}>
                    <h4>Created At: </h4>
                    <p style={{marginTop: '18.62px'}}>{new Date(data.CreatedAt).toLocaleString()}</p>
                </div>
            </div>

            <Flex gap="middle" className="title-line" justify="space-between">
                <h2>{data.Title}</h2>
                <div>
                <Button color="default" variant="solid" className="ticket-edit-btn" href={`/tickets/edit/${data.TicketID}`} style={{marginRight: 10}}>Edit</Button>
                <ConfirmTicketDeleteModal ticketID={data.TicketID} comments={commentData}/>
                </div>
            </Flex>
            
            <Card >
                <div style={{display: 'flex', gap: 10}}>
                        <div style={{display: 'flex', gap: 10}}>
                            <h4>Created By: </h4>
                            <p style={{marginTop: '18.62px'}}>{data.CreatedByName}</p>
                        </div>
                        <div style={{display: 'flex', gap: 10}}>
                            <h4>Category: </h4>
                            <p style={{marginTop: '18.62px'}}>{data.CategoryName}</p>
                        </div>
                        {
                            data.UpdatedAt ? 
                            <div style={{display: 'flex', gap: 10}}>
                            <h4>Updated At: </h4>
                            <p style={{marginTop: '18.62px'}}>{new Date(data.UpdatedAt).toLocaleString()}</p>
                            </div>
                            :
                            ""
                        }
                </div>
                <p>{data.Description}</p>
                <h3>Description</h3>
            </Card>
            
            <div className="comments-container">
                {
                    commentData && commentData.map((comment) => (
                        <Card key={comment.CommentID} className="comment-card">
                            <Flex vertical>
                            <div className="comment-info">
                                <p>By: {comment.FullName}</p>
                                <p>At: {new Date(comment.CreatedAt).toLocaleString()}</p>
                            </div>
                            <div>
                                {comment.Comment}
                            </div>
                            <div className="comment-edit-btn">
                                <EditComment commentID={comment.CommentID} commentText={comment.Comment}/>
                                <ConfirmDeleteModal commentID={comment.CommentID}/>
                            </div>
                            </Flex>
                        </Card>
                    ))
                }
            </div>
            <Tooltip placement="bottomRight"  title="Add Comment">
                <div className="add-comment-btn">
                    <CreateComment ticketID={id}/>
                </div>
            </Tooltip>
        </div> 
         
         }
    </div>
  )
}

export default TicketDetails
