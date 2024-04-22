import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';
import ListIcon from '@mui/icons-material/List';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import EventIcon from '@mui/icons-material/Event';


export const items = [

    {
        id: 2,
        path: "/home",
        title: "Student Info",
        icon: <PersonIcon />,
        dropdowns: [
            {
                id: 21,
                path: "/home/new-student/:studentId",
                icon: <AddBoxOutlinedIcon />,
                title: "Add Student",
            },
            {
                id: 23,
                path: "/home/new-employee/:employeeId",
                icon: <AddBoxOutlinedIcon />,
                title: "Add Employee",
            },
            {
                id: 22,
                path: "/home/display-students",
                icon: <ListIcon />,
                title: "Students List",
            },
            {
                id: 24,
                path: "/home/display-employees",
                icon: <ListIcon />,
                title: "Employees List",
            },
        ],
    },
    {
        id: 3,
        path: "/home",
        title: "Attendance",
        icon: <CalendarMonthIcon />,
        dropdowns: [
            {
                id: 31,
                path: "/home/add-attendance",
                icon: <AddBoxOutlinedIcon />,
                title: "Add Attendance",
            },
            {
                id: 32,
                path: "/home/display-attendance",
                icon: <ListIcon />,
                title: "View Attendance",
            },
        ],
    },
    {
        id: 5,
        title: 'Customer',
        path: "/home",
        icon: <PersonIcon />,
        dropdowns: [
            {
                id: 51,
                path: "/home/new-customer/:invoiceId",
                title: "Add Customer",
                icon: <AddBoxOutlinedIcon />
            },
            {
                id: 52,
                path: "/home/customer/view",
                title: "Customer List",
                icon: <ListIcon />
            }
        ]
    },
    {
        id: 10,
        title: 'Vendors',
        path: "/home",
        icon: <PersonIcon />,
        dropdowns: [
            {
                id: 101,
                path: "/home/createVendor",
                title: "Add Vendor",
                icon: <AddBoxOutlinedIcon />
            },
            {
                id: 102,
                path: "/home/vendors",
                title: "Manage Vendors",
                icon: <ListIcon />
            },
        ]
    },
    {
        id: 11,
        title: 'Leads',
        path: "/home",
        icon: <PersonIcon />,
        dropdowns: [
            {
                id: 111,
                path: "/home/create_Lead",
                title: "Add Lead",
                icon: <AddBoxOutlinedIcon />
            },
            {
                id: 113,
                path: "/home/excel-leads",
                title: "Manage Leads",
                icon: <ListIcon />
            },
            {
                id: 112,
                path: "/home/rescheduled-leads",
                title: "Rescheduled list",
                icon: <ListIcon />
            },
        ]
    },
    {
        id: 4,
        path: "/home",
        title: "Receipt",
        icon: <ReceiptIcon />,
        dropdowns: [
            {
                id: 41,
                path: "/home/cashin",
                icon: <ListIcon />,
                title: "Cash-In",
            },
            {
                id: 42,
                path: "/home/cashout",
                icon: <ListIcon />,
                title: "Cash-Out",
            },

        ],
    },
    {
        id: 16,
        title: "Interview",
        icon: <EventIcon />,
        path: "/home",
        dropdowns: [
            {
                id: 161,
                path: "/home/add-interview",
                icon: <AddBoxOutlinedIcon />,
                title: "Schedule",
            },
            {
                id: 162,
                path: "/home/view-interview",
                icon: <ListIcon />,
                title: "Manage Interview",
            },
        ],
    },
    {
        id: 17,
        title: "Reports",
        icon: <BarChartIcon />,
        path: "/home",
        dropdowns: [
            {
                id: 171,
                path: "/home/manage-reports",
                icon: <ListIcon />,
                title: "Manage Reports",
            },
        ],
    },
    {
        id: 6,
        title: "Billing",
        icon: <PaymentsIcon />,
        path: "/home",
        dropdowns: [
            {
                id: 61,
                path: "/home/gstbilling",
                icon: <ReceiptLongOutlinedIcon />,
                title: "GST",
            },
            {
                id: 62,
                path: "/home/nongstbilling",
                icon: <ReceiptLongOutlinedIcon />,
                title: "Non-GST",
            },
        ],
    },
    {
        id: 7,
        title: "Master",
        icon: <ShoppingBagIcon />,
        path: "/home",
        dropdowns: [

            {
                id: 71,
                icon: <BadgeOutlinedIcon />,
                path: "/home/invoice_id",
                title: "Invoice No",
            },

            {
                id: 72,
                icon: <BadgeOutlinedIcon />,
                path: "/home/std_id",
                title: "Student Id",
            },
            {
                id: 73,
                icon: <BadgeOutlinedIcon />,
                path: "/home/employee_id",
                title: "Employee Id",
            },
            {
                id: 74,
                icon: <LocalLibraryOutlinedIcon />,
                path: "/home/add_staff",
                title: "Create Staff",
            },
            {
                id: 75,
                icon: <LocalLibraryOutlinedIcon />,
                path: "/home/course_fees",
                title: "Course Fees",
            },
            {
                id: 76,
                icon: <LocalLibraryOutlinedIcon />,
                path: "/home/admins",
                title: "Admins",
            },

        ],
    },
    {
        id: 8,
        title: "Logout",
        icon: <LogoutIcon />,
        path: "/login"
    }
];
