// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// icons
const icons = {
  CurrencyRupeeIcon,
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Fees management',
      type: 'item',
      url: '/feespay',
      icon: icons.CurrencyRupeeIcon
    },
    {
      id: 'fees-logs',
      title: 'Fees Logs',
      type: 'item',
      url: '/allFeesLogIndex',
      icon: icons.CurrencyRupeeIcon
    },
    {
      id: 'util-discount',
      title: 'Discount Index',
      type: 'item',
      url: '/discount',
      icon: icons.CurrencyRupeeIcon
    },
    
    {
      id: 'time-table',
      title: 'Time Table ',
      type: 'item',
      url: '/timeTableIndex',
      icon: icons.BgColorsOutlined
    },
  
    {
      id: 'Student-attenance',
      title: 'Student-attenance ',
      type: 'item',
      url: '/Studattenance',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'Mark-Allocation',
      title: 'Marks Allocation ',
      type: 'item',
      url: '/MarkAllocation',
      icon: icons.BgColorsOutlined
    },
  
  ]
};


export default utilities;
