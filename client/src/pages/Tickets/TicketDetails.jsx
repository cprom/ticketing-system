import { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, Spin } from "antd";
import Badge from "antd/es/badge/Badge";

const TicketDetails = () => {

        const { id } = useParams();
        const [show, setShow] = useState(true);
    console.log(id)

       const getTickets = async () => {
        const response = await fetch(`http://localhost:3000/api/tickets/${id}`);
        return await response.json();
    }

    const { data, error, isPending } = useQuery({
        queryKey: ['tickets'],
        queryFn: getTickets
    });

    if(error){
        console.log(`Fetching Error: ${error}`);
    }

    console.log(data)

  return (
    <div>
        {
        isPending ?
        <Spin size="large" className="spinner-container"/> 
         : 
        <div className="ticket-container">
            <div style={{display: 'flex', gap: '15px'}}>
                <h2>Ticket #: {data.TicketID}</h2>
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
            </div>

            <h2>{data.Title}</h2>
            <div style={{display: 'flex', gap: 10}}>
            <Card style={{width: 800, height: 300}}>
                <h3>Description</h3><p>{data.Description}</p>
            </Card>
            <Card style={{width: 500, minHeight: 300}}>
                <div style={{display: 'flex-column', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>
                    <div style={{display: 'flex', gap: 10}}>
                        <h4>Assigned To: </h4>
                        <p style={{marginTop: '18.62px'}}>{data.AssignedToName ? data.AssignedToName : "unassigned"}</p>
                    </div>
                    <div style={{display: 'flex', gap: 10}}>
                        <h4>Created By: </h4>
                        <p style={{marginTop: '18.62px'}}>{data.CreatedByName}</p>
                    </div>
                    <div style={{display: 'flex', gap: 10}}>
                        <h4>Created At: </h4>
                        <p style={{marginTop: '18.62px'}}>{data.CreatedAt}</p>
                        </div>
                    <div style={{display: 'flex', gap: 10}}>
                        <h4>Category: </h4>
                        <p style={{marginTop: '18.62px'}}>{data.CategoryName}</p>
                    </div>
                    {
                        data.UpdatedAt ? 
                        <div style={{display: 'flex', gap: 10}}>
                        <h4>Updated At: </h4>
                        <p style={{marginTop: '18.62px'}}>{data.UpdatedAt}</p>
                        </div>
                        :
                        ""
                    }
                </div>
            </Card>
            </div>
            
        </div> 
         
         }
    </div>
  )
}

export default TicketDetails
