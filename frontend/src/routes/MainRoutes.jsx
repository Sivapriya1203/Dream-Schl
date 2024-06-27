import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

import { element } from 'prop-types';

// Your component imports
import StaffApplication from 'components/TeachersDomain/StaffApplication';
import StudentAllocation from 'components/StudentsDomain/StudentAllocation';
import DepartmentAlloc from 'components/Department/DepartmentAlloc';
import AddDepartment from 'components/Department/AddDepartment';
import Allocation from 'components/StudentsDomain/Allocation';
import EditAlloc from 'components/StudentsDomain/EditAlloc';
import Feespay from 'pages/component-overview/Feesmanagement/Feespay';
import FeesApplication from 'pages/component-overview/Feesmanagement/FeesApplication';
import PayFeesLog from 'pages/component-overview/Feesmanagement/PayFeesLog';
import Timetable from 'components/Timetable/Timetable';
import DiscountIndex from 'components/Discount/DiscountIndex';
import ClassTeach from 'components/StaffAllocation/ClassTeach';
import Studentsattenance from 'components/Employee/Studentsattenance';
import Students from 'components/EmployeField/Students';
import MarkAllocation from 'components/Marks/MarkAllocation';
// import Mystudents from 'components/EmployeField/Mystudents';

const Login = Loadable(lazy(() => import('pages/authentication/login')));
const AddStaffAllocation = Loadable(lazy(() => import('components/StaffAllocation/AddStaffAllocation')));
const StaffAllocationIndex = Loadable(lazy(() => import('components/StaffAllocation/StaffAllocationIndex')));
const Invoice = Loadable(lazy(() => import('components/Invoice/Invoice')));
const AllFeesLogIndex = Loadable(lazy(() => import('pages/component-overview/Feesmanagement/AllFeesLogIndex')));
const SingleFeeDiscountIndex = Loadable(lazy(() => import('components/Discount/SingleFeeDiscountIndex')));
const FeesPendingStudentsIndex = Loadable(lazy(() => import('components/FeesPendingStudents/FeesPendingStudentsIndex')));
const TimeTableIndex = Loadable(lazy(() => import('components/Timetable/TimeTableIndex')));
const SiblingStudentsIndex = Loadable(lazy(() => import('components/StudentsDomain/SiblingStudentsIndex')));
const FeesLogsIndex = Loadable(lazy(() => import('pages/component-overview/Feesmanagement/FeesLogsIndex')));
const StudentApplication = Loadable(lazy(() => import('components/StudentsDomain/StudentApplication')));
const AllStudents = Loadable(lazy(() => import('components/StudentsDomain/AllStudents')));
const Allstaffs = Loadable(lazy(() => import('components/TeachersDomain/Allstaffs')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const EmployeDash = Loadable(lazy(() => import('pages/empdashboard/index')));

const adminRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'allStudents',
      element: <AllStudents />,
    },
    {
      path: 'addStudent',
      element: <StudentApplication />,
    },
    {
      path: 'sibStu',
      element: <SiblingStudentsIndex />,
    },
    {
      path: 'feePendingStu',
      element: <FeesPendingStudentsIndex />,
    },
    {
      path: 'discount',
      element: <DiscountIndex />,
    },
    {
      path: 'singleFeesDiscountIndex/:fees_id',
      element: <SingleFeeDiscountIndex />,
    },
    {
      path: 'timetable',
      element: <Timetable />,
    },
    {
      path: 'timeTableIndex',
      element: <TimeTableIndex />,
    },
    {
      path: 'studentalloc/:cls_id',
      element: <StudentAllocation />,
    },
    {
      path: 'addStaff',
      element: <StaffApplication />,
    },
    {
      path: 'allstaffs',
      element: <Allstaffs />,
    },
    {
      path: 'addStaffAllocation',
      element: <AddStaffAllocation />,
    },
    {
      path: 'staffAllocationIndex',
      element: <StaffAllocationIndex />,
    },
    {
      path: 'department',
      element: <DepartmentAlloc />,
    },
    {
      path: 'editalloc',
      element: <EditAlloc />,
    },
    {
      path: 'addDept',
      element: <AddDepartment />,
    },
    {
      path: 'allocation',
      element: <Allocation />,
    },
    {
      path: 'feespay',
      element: <Feespay />,
    },
    {
      path: 'allFeesLogIndex',
      element: <AllFeesLogIndex />,
    },
    {
      path: 'invoice',
      element: <Invoice />,
    },
    {
      path: 'payfeeslog',
      element: <PayFeesLog />,
    },
    {
      path: 'feeLogsByFeeId/:fees_id',
      element: <FeesLogsIndex />,
    },
    {
      path: 'feesapplication',
      element: <FeesApplication />,
    },
    {
      path: 'classteach',
      element: <ClassTeach />,
    },
    {
      path: 'Studattenance',
      element: <Studentsattenance />,
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
   
  ]
};

const employeeRoutes = {
  path: '/',
  element: <Dashboard/>,
  children: [
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <EmployeDash/>
        }
      ]
    },
   
    {
      path: '/',
      element: <EmployeDash/>
    },
    {
      path:'markallocation',
      element:<MarkAllocation/>
    },
    {
      path: '/classstudents',
      element: <Students/>
    },
    
  ]
};

const MainRoutes = sessionStorage.getItem("admin") ? adminRoutes :
  (sessionStorage.getItem("employeeLoggedIn") ? employeeRoutes : {
    path: '/',
    element: <Login />
  });

export default MainRoutes;
