import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { Table, Badge, Space, Switch } from 'antd';
import Column from 'antd/es/table/Column';

const TicketsList = () => {

    const [show, setShow] = useState(true);

       const getTickets = async () => {
        const response = await fetch(`http://localhost:3000/api/tickets/`);
        return await response.json();
    }

    const { data, error, isPending } = useQuery({
        queryKey: ['tickets'],
        queryFn: getTickets
    });

    if(error){
        console.log(`Fetching Error: ${error}`);
    }



    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'TicketID',
            defaultSortOrder: 'descend',
            key: 'TicketID',
            sorter: (a,b) => a.TicketID - b.TicketID,
            render: text => <a href={`/tickets/${text}`} >{text}</a>
        },
        {
            title: 'Title',
            dataIndex: 'Title',
            key: 'Title'
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description'
        },
        {
            title: 'Created By',
            dataIndex: 'CreatedByName',
            key: 'CreatedByName'
        },
        {
            title: 'Assigned To',
            dataIndex: 'AssignedToName',
            key: 'AssignedToName'
        },
        {
            title: 'Status',
            dataIndex: 'StatusName',
            key: 'StatusName',
            filters: [
                {
                    text: 'Open',
                    value: 'Open',
                },
                {
                    text: 'In Progress',
                    value: 'In Progress'
                },
                {
                    text: 'Resloved',
                    value: 'Resolved'
                },
                {
                    text: 'Closed',
                    value: 'Closed'
                }
            ],
            onFilter: (value, record) => record.StatusName.indexOf(value) === 0,
        },
        {
            title: 'Priority',
            dataIndex: 'PriorityName',
            key: 'PriorityName',
            render: text => 
                text === 'Low' ? <Badge count={show ? 'Low' : 0} showZero color="#ebebebff" style={{color: 'black'}}/> 
                : text === 'Medium' ? <Badge count={show ? 'Medium' : 0} showZero color="#fbf837ff" style={{color: 'black'}}/> 
                : text === 'High' ? <Badge count={show ? 'High' : 0} showZero color="#ff8800ff" /> 
                : text === 'Critical' ? <Badge count={show ? 'Critical' : 0} showZero color="#ff0000ff" /> 
                : ""
            ,
            filters: [
                {
                    text: 'Low',
                    value: 'Low'
                },
                {
                    text: 'Medium',
                    value: 'Medium'
                },
                {
                    text: 'High',
                    value: 'High'
                },
                {
                    text: 'Critical',
                    value: 'Critical'
                }
            ],
            onFilter: (value, record) => record.PriorityName.indexOf(value) === 0,
        },
        {
            title: 'Category',
            dataIndex: 'CategoryName',
            key: 'CategoryName',
            filters: [
                {
                    text: 'Hardware',
                    value: 'Hardware'
                },
                {
                    text: 'Software',
                    value: 'Software'
                
                },
                {
                    text: 'Access',
                    value: 'Access'
                
                },
                {
                    text: 'Network',
                    value: 'Network'
                
                },
                {
                    text: 'Other',
                    value: 'Other'
                }
            ],
            onFilter: (value, record) => record.CategoryName.indexOf(value) === 0,
        },
        {
             title: 'Created On',
             dataIndex: 'CreatedAt',
             key: 'CreatedAt',
             sorter: (a, b) => a.CreatedAt - b.CreatedAt,   
        },
        {
            title: 'Action',
            dataIndex: 'TicketID',
            key: 'operation',
            fixed: 'end',
            width: 100,
            render: (text) =><a href={`/tickets/${text}`} >View</a>
        }
    ]

    const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    };

  return (
    <div>
        { isPending 
        ? <div className='spinner-container'><Spin /></div> 
        : <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={{target: 'sorter-icon'}}
        rowKey={record => record.TicketID}
        />
        }
    
    </div>
  )
}

export default TicketsList
