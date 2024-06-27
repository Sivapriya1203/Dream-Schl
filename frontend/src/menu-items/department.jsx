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
  
  const department = {
    id: 'department',
    title: 'Allocation',
    type: 'group',
    children: [
      {
        id: 'Department Allocation',
        title: 'Department Allocation',
        type: 'item',
        url: '/department',
        icon: icons.SchoolIcon
      },
      {
        id: 'staff-allocation',
        title: 'Teacher Allocation',
        type: 'item',
        url: '/staffAllocationIndex',
        icon: icons.GroupIcon,

      },
      {
        id: 'Student Allocation',
        title: 'Student Allocation',
        type: 'item',
        url: '/allocation',
        icon: icons.SchoolIcon
      },
      
    ]
  };
  
  export default department;
  