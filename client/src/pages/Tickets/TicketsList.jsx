import { useEffect, useState } from 'react';

import { Table, Badge, Space, Switch } from 'antd';
import Column from 'antd/es/table/Column';

const TicketsList = () => {

    const [fetchedTicketData, setFetchedTicketData] = useState();
    const [show, setShow] = useState(true);

//     const ticketsArray = [
//         {
//   "TicketID": 8,
//   "Title": "Seeded Ticket 2",
//   "Description": "Ticket seeded by script for testing 2",
//   "CreatedAt": "2026-01-20T20:43:59.003Z",
//   "UpdatedAt": null,
//   "CreatedByName": "Support Agent",
//   "AssignedToName": null,
//   "StatusName": "Open",
//   "PriorityName": "High",
//   "CategoryName": "Software"
// },
// {
//   "TicketID": 9,
//   "Title": "Seeded Ticket 3",
//   "Description": "Ticket seeded by script for testing 3",
//   "CreatedAt": "2026-01-20T20:43:59.003Z",
//   "UpdatedAt": null,
//   "CreatedByName": "Support Agent",
//   "AssignedToName": null,
//   "StatusName": "Open",
//   "PriorityName": "High",
//   "CategoryName": "Software"
// }
//     ]

    const fetchTicketData = async() => {
        const url = "http://localhost:3000/api/tickets/"
        try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error (`Error fetching data: ${Error}`)
            }
            const ticketData = await response.json();
            setFetchedTicketData(ticketData)
        }
        catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchTicketData();
    }, [])

    console.log(fetchedTicketData)

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
    <Table
        columns={columns}
        dataSource={fetchedTicketData}
        onChange={onChange}
        showSorterTooltip={{target: 'sorter-icon'}}
        rowKey={record => record.TicketID}
        />
    </div>
  )
}

export default TicketsList
