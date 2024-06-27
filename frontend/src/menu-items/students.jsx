// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
  } from '@ant-design/icons';

import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
  
  // icons
  const icons = {
    SchoolIcon,
    GroupIcon,
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined

  };
  
  // ==============================|| MENU ITEMS - UTILITIES ||============================== //
  
  const domains = {
    id: 'Entries',
    title: 'Domains',
    type: 'group',
    children: [
      {
        id: 'student-index',
        title: 'Students',
        type: 'item',
        url: '/allStudents',
        icon: icons.SchoolIcon
      },
      {
        id: 'class-students',
        title: 'class-Students',
        type: 'item',
        url: '/classstudents',
        icon: icons.SchoolIcon
      },
      
      {
        id: 'staff-index',
        title: 'Teachers',
        type: 'item',
        url: '/allstaffs',
        icon: icons.GroupIcon,

      },
   
      
    ]
  };
  
  export default domains;
  