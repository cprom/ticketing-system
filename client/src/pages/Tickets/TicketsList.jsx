import { useEffect, useState } from 'react';

import { Table } from 'antd';

const TicketsList = () => {

    const [fetchedTickeData, setFetchedTicketData] = useState();

    const ticketsArray = [
        {
  "TicketID": 8,
  "Title": "Seeded Ticket 2",
  "Description": "Ticket seeded by script for testing 2",
  "CreatedAt": "2026-01-20T20:43:59.003Z",
  "UpdatedAt": null,
  "CreatedByName": "Support Agent",
  "AssignedToName": null,
  "StatusName": "Open",
  "PriorityName": "High",
  "CategoryName": "Software"
},
{
  "TicketID": 9,
  "Title": "Seeded Ticket 3",
  "Description": "Ticket seeded by script for testing 3",
  "CreatedAt": "2026-01-20T20:43:59.003Z",
  "UpdatedAt": null,
  "CreatedByName": "Support Agent",
  "AssignedToName": null,
  "StatusName": "Open",
  "PriorityName": "High",
  "CategoryName": "Software"
}
    ]

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

    console.log(fetchedTickeData)

    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'TicketID',
            defaultSortOrder: 'descend',
            sorter: (a,b) => a.TicketID - b.TicketID,
        },
        {
            title: 'Title',
            dataIndex: 'Title',
        },
        {
            title: 'Description',
            dataIndex: 'Description'
        },
        {
            title: 'Created By',
            dataIndex: 'CreatedBy'
        },
        {
            title: 'Assigned To',
            dataIndex: 'AssignedTo'
        },
        {
            title: 'Status',
            dataIndex: 'StatusName',
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
            filter: [
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
             sorter: (a, b) => a.CreatedAt - b.CreatedAt,   
        }
    ]

    const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    };

  return (
    <div>
    <Table
        columns={columns}
        dataSource={fetchedTickeData}
        onChange={onChange}
        showSorterTooltip={{target: 'sorter-icon'}}
        />
    </div>
  )
}

export default TicketsList
