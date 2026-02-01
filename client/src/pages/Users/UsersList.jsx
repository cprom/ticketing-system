import {useState} from 'react'
import { useQuery } from '@tanstack/react-query';
import { Button, Spin, Tooltip } from "antd";
import { Table, Badge, Space, Switch } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const UsersList = () => {

    const [fetchedData, setFetchData] = useState([]);

    const getUser = async () => {
        const response = await fetch(`${apiUrl}/api/users`);
        const results = await response.json();
        setFetchData(results);
        return results
    }

    const { data, error, isPending } = useQuery({
        queryKey: ['users'],
        queryFn: getUser
    });

    if(error){
        console.log(`User Fetching Error: ${error}`);
    }


    const columns = [
        {
            title: 'User ID',
            dataIndex: 'UserID',
            defaultSortOrder: 'descend',
            key: 'UserID',
            width: 200,
            sorter: (a,b) => a.UserID - b.UserID,
            render: text => <a href={`/user/${text}`} >{text}</a>
        },
        {
            title: 'Full Name',
            dataIndex: 'FullName',
            key: 'FullName',
            sorter: (a,b) => a.FullName - b.FullName,
        },
        {
            title: 'Email',
            dataIndex: 'Email',
            key: 'Email'
        },
        {
            title: 'Role',
            dataIndex: 'RoleID',
            key: 'RoleID',
            render: text => 
              text === 1 ? "Admin"
            : text === 2 ? "Agent"
            : text === 3 ? " User"
            : "",
             filters: [
                {
                    text: 'Admin',
                    value: '1'
                },
                {
                    text: 'Agent',
                    value: '2'
                },
                {
                    text: 'User',
                    value: '3'
                }
            ],
            onFilter: (value, record) => record.RoleID === Number(value),
        },
        {
            title: 'Action',
            dataIndex: 'UserID',
            key: 'UserID',
            fixed: 'end',
            width: 100,
            render: (text) =><a href={`/user/${text}`} >View</a>
        }
    ]

  return (
    <div>
      <div className='add-new-ticket-btn'>
        <Button color="default" variant='solid' icon={<PlusOutlined/>} href='/user/new'>New User</Button>
      </div>
        { isPending 
        ? <div className='spinner-container'><Spin /></div> 
        : <Table
        columns={columns}
        dataSource={fetchedData}
        showSorterTooltip={{target: 'sorter-icon'}}
        rowKey={record => record.UserID}
        />
        }
    
    </div>
  )
}

export default UsersList