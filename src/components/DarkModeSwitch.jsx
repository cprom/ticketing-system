import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Space, Switch } from 'antd';
import { useState } from 'react';
import DarkModeContext from '../Context/DarkModeContext';

const DarkModeSwitch = ({sendDataToParent}) => {

    const [isDark, setIsDark] = useState();
    const handleChange = (checked) => {
    setIsDark(checked)
    sendDataToParent(checked)
  }

  return (

  <Space vertical>
    <Switch checked={isDark} checkedChildren="Light" unCheckedChildren="Dark" defaultChecked onChange={handleChange}/>
  </Space>
  )
};


export default DarkModeSwitch;