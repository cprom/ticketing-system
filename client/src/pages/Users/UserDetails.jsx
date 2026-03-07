import { useQuery } from '@tanstack/react-query';
import { Avatar, Card, Spin, Image, Flex, Button, Col, Row, Tooltip } from 'antd';
import { EditOutlined, 
    EllipsisOutlined, 
    SettingOutlined,
     UserOutlined, 
     MailOutlined, 
     PhoneTwoTone, 
     MailTwoTone, 
     IdcardOutlined, 
     PhoneOutlined, 
     EnvironmentOutlined, 
     RocketOutlined, 
     BankOutlined, 
     CrownOutlined, 
     SafetyOutlined, 
     MessageOutlined, 
     MessageTwoTone } from '@ant-design/icons';
import avatar from '../../assets/img/avatar.jpg'

import { useParams } from 'react-router';
import ConfirmDeleteUserModal from '../../components/Modal/ConfirmDeleteUserModal';
const { Meta } = Card;
const apiUrl = import.meta.env.VITE_BASE_API_URL;

const UserDetails = () => {
    const { id } = useParams();

    const getUserInfo = async () => {
        const response = await fetch(`${apiUrl}/api/users/${id}`,
            {
                method: "GET",
                credentials: "include"
            }
        );
        return await response.json();
    }

    const {data: userData, error, isPending } = useQuery({
        queryKey: ['user', id],
        queryFn: getUserInfo
    })

    if(error){
        console.log(`User Fetching error ${error}`);
    }

    const openTeamsChat = (email) => {
    const url = `msteams:/l/chat/0/0?users=${email}`;
    window.location.href = url;
    };

  return (
    <div>
        { isPending ? <Spin size='large'/>
    :
    <div>
        <Card style={{width: 400, border: 'none'}}>
        <Flex>
            <Image
                alt="user photo"
                style={{borderRadius: '50%', width: 100, height: 100, border: '1px solid black', margin: 20}}
                src={avatar}
            />
                <div>
                    <p style={{fontSize: 24, marginBottom: 0}}>{userData && userData.FullName}</p>
                    <p style={{marginTop: 0, color: 'gray'}}>{userData && userData.JobTitle} &middot; {userData.DepartmentName} </p>
                <Flex gap={5}>
                    <Tooltip placement='bottom' title={`Call ${userData.FullName}`}>
                        <Button variant="outlined" color='default' href={`tel:${userData.PhoneNumber}`}><PhoneTwoTone/></Button>
                    </Tooltip>
                    <Tooltip placement='bottom' title={`Email ${userData.FullName}`}>
                        <Button href={`mailto:${userData.Email}`}><MailTwoTone /></Button>
                    </Tooltip>
                    <Tooltip placement='bottom' title={`Chat with ${userData.FullName}`}>
                        <Button onClick={() => openTeamsChat(userData.Email)}><MessageTwoTone/></Button>
                    </Tooltip>
                </Flex>
                </div>
        </Flex>
        </Card>
            <Flex gap="middle" className="title-line" justify="end">
               
                <Tooltip placement='bottom' title={`Edit ${userData.FullName} info`}>
                    <Button color="default" variant="outlined"  href={`/user/edit/${userData.UserID}`} ><EditOutlined/>Edit</Button>
                </Tooltip>
                <ConfirmDeleteUserModal userData={{userData}} />
             
            </Flex>

        <Card style={{minHeight: 300, marginTop: 10}} >
            <Row>
            <Col xs={{ span: 8 }}>
               <Flex>
                <IdcardOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                 <div>
                    <p style={{marginBottom: 0, color: 'gray'}}>ID</p> 
                    <p style={{marginTop: 0}}>{userData && userData.UserID}</p>
                 </div>
               </Flex>
            </Col>
            <Col xs={{ span: 8 }}>
                <Flex>
                    <UserOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                    <div>
                        <p style={{marginBottom: 0, color: 'gray'}}>Display Name</p>
                         <p style={{marginTop: 0}}>{userData && userData.FullName}</p>
                    </div>
                </Flex>
            </Col>
            <Col xs={{ span: 8 }}>
                <Flex>
                    <EnvironmentOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                    <div>
                        <p style={{marginBottom: 0, color: 'gray'}}>Address</p> 
                        <p style={{marginTop: 0}}>{userData &&  userData.Address}</p>
                    </div>
                </Flex>
            </Col>
            </Row>
            <Row>
            <Col xs={{ span: 8 }}>
                <Flex>
                    <PhoneOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                    <div>
                        <p style={{marginBottom: 0, color: 'gray'}}>Phone</p> 
                        <a style={{marginTop: 0}} href={`tel:${userData.PhoneNumber}`}>{userData &&  userData.PhoneNumber}</a>
                    </div>
                </Flex>
            </Col>
            <Col xs={{ span: 8 }}>
                <Flex>
                    <MailOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                    <div>
                        <p style={{marginBottom: 0, color: 'gray'}}>Email</p> 
                        <a style={{marginTop: 0}} href={`mailto:${userData.Email}`}>{userData &&  userData.Email}</a>
                    </div>
                </Flex>
            </Col>
            <Col xs={{ span: 8 }}>
                <Flex>
                    <RocketOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                    <div>
                        <p style={{marginBottom: 0, color: 'gray'}}>Role </p> 
                        <p style={{marginTop: 0}}>{userData.RoleName}</p> 
                    </div>
                </Flex>
            </Col>
            </Row>
            <Row>
            <Col xs={{ span: 8 }}>
            <Flex>
                 <CrownOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                 <div>
                    <p style={{marginBottom: 0, color: 'gray'}}>Title </p> 
                    <p style={{marginTop: 0}}>{userData.JobTitle}</p>
                 </div>
            </Flex>

            </Col>
            <Col xs={{ span: 8 }}>
                <Flex>
                    <BankOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                    <div>
                        <p style={{marginBottom: 0, color: 'gray'}}>Department </p> 
                        <p style={{marginTop: 0}}>{userData.DepartmentName}</p>
                    </div>
                </Flex>
            </Col>
            <Col xs={{ span: 8 }}>
                <Flex>
                    <SafetyOutlined style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                    <div>
                        <p style={{marginBottom: 0, color: 'gray'}}>Manager </p> 
                        <p style={{marginTop: 0}}>{userData.ManagerName}</p>
                    </div>
                </Flex>
            </Col>
            </Row>
        </Card>
           
    </div>
    }
    </div>
  )
}

export default UserDetails
