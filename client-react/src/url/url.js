const API_REGISTER_URL = "http://localhost:8011/hrm/register";

const API_LOGIN_URL = "http://localhost:8011/hrm/login";

const API_GET_REGISTERED_USERS = "http://localhost:8011/hrm/user";

const API_CHECK_REGISTERD_USERS = "http://localhost:8011/hrm/userCheck";

const JWT_CREDINIALS = "hRmDashboard2023Login";

const API_USER_GOALS = "http://localhost:8011/goals";

const API_UPDATE_USER = "http://localhost:8011/hrm/updateUser";


// students api 
const API_ADD_STUDENT = "http://localhost:8011/info/addStudent";

const API_GET_STUDENT = "http://localhost:8011/info/allStudents";

const API_UPDATE_STUDENT = "http://localhost:8011/info/updateStudent";

const API_DELETE_STUDENT = "http://localhost:8011/info/deleteStudent";

// employee api
const API_ADD_EMPLOYEE = "http://localhost:8011/employee/addEmployee";

const API_GET_EMPLOYEE = "http://localhost:8011/employee/allEmployees";

const API_UPDATE_EMPLOYEE = "http://localhost:8011/employee/updateEmployee";

const API_DELETE_EMPLOYEE = "http://localhost:8011/employee/deleteEmployee";

const API_CONVERT_TO_EMPLOYEE = "http://localhost:8011/employee/convertToEmployee";

// attendance api
const API_ADD_ATTENDANCE = "http://localhost:8011/attendance/addAttendance";

const API_GET_ATTENDANCE = "http://localhost:8011/attendance/getAttendance";

const API_UPDATE_ATTENDANCE = "http://localhost:8011/attendance/updateAttendance";

const API_DELETE_ATTENDANCE = "http://localhost:8011/attendance/deleteAttendance";

// client api
const API_ADD_CLIENT = "http://localhost:8011/clients/addClient";

const API_GET_CLIENT = "http://localhost:8011/clients/allClients";

const API_DELETE_CLIENT = "http://localhost:8011/clients/deleteClient";

// client api
const API_CREATE_INVOICE = "http://localhost:8011/invoiceDetail/addInvoice";

const API_SHOW_INVOICES = "http://localhost:8011/invoiceDetail/allInvoices";

const API_DELETE_INVOICE = "http://localhost:8011/invoiceDetail/deleteInvoice";

const API_UPDATE_INVOICE = "http://localhost:8011/invoiceDetail/updateInvoice";

// course api 
const API_FETCH_COURSE = "http://localhost:8011/course/allCourses";

const API_CREATE_COURSE = "http://localhost:8011/course/createCourse";

const API_UPDATE_COURSE = "http://localhost:8011/course/updateCourse";

const API_DELETE_COURSE = "http://localhost:8011/course/deleteCourse";

// studentReceipt api
const API_FETCH_STUDENT_RECEIPT = "http://localhost:8011/studentReceipt/allReceipts";

const API_CREATE_STUDENT_RECEIPT = "http://localhost:8011/studentReceipt/addReceipt";

const API_UPDATE_STUDENT_RECEIPT = "http://localhost:8011/studentReceipt/updateReceipt";

const API_DELETE_STUDENT_RECEIPT = "http://localhost:8011/studentReceipt/deleteReceipt";

// customerReceipt api
const API_FETCH_CUSTOMER_RECEIPT = "http://localhost:8011/customerReceipt/allReceipts";

const API_CREATE_CUSTOMER_RECEIPT = "http://localhost:8011/customerReceipt/addReceipt";

const API_UPDATE_CUSTOMER_RECEIPT = "http://localhost:8011/customerReceipt/updateReceipt";

const API_DELETE_CUSTOMER_RECEIPT = "http://localhost:8011/customerReceipt/deleteReceipt";

// Cashout API
const API_FETCH_CASHOUT_RECEIPT = "http://localhost:8011/cashout/allReceipts";

const API_CREATE_CASHOUT_RECEIPT = "http://localhost:8011/cashout/addReceipt";

const API_UPDATE_CASHOUT_RECEIPT = "http://localhost:8011/cashout/updateReceipt";

const API_DELETE_CASHOUT_RECEIPT = "http://localhost:8011/cashout/deleteReceipt";

// Vendors API
const API_FETCH_VENDOR_DETAILS = "http://localhost:8011/vendors/allVendors";

const API_CREATE_VENDOR_DETAIL = "http://localhost:8011/vendors/addVendor";

const API_UPDATE_VENDOR_DETAIL = "http://localhost:8011/vendors/updateVendor";

const API_DELETE_VENDOR_DETAIL = "http://localhost:8011/vendors/deleteVendor";

// Staff API
const API_FETCH_STAFF_DETAILS = "http://localhost:8011/staff/allStaff";

const API_CREATE_STAFF_DETAIL = "http://localhost:8011/staff/addStaff";

const API_UPDATE_STAFF_DETAIL = "http://localhost:8011/staff/updateStaff";

const API_DELETE_STAFF_DETAIL = "http://localhost:8011/staff/deleteStaff";

// Lead API
const API_FETCH_LEAD_DETAILS = "http://localhost:8011/lead/allLeads";

const API_CREATE_LEAD_DETAIL = "http://localhost:8011/lead/addLead";

const API_UPDATE_LEAD_DETAIL = "http://localhost:8011/lead/updateLead";

const API_DELETE_LEAD_DETAIL = "http://localhost:8011/lead/deleteLead";

// Lead Excel API
// LeadData API
const API_FETCH_LEAD_DATA_DETAILS = "http://localhost:8011/leadData/allLead";

const API_CREATE_LEAD_DATA_DETAIL = "http://localhost:8011/leadData/addLead";

const API_UPDATE_LEAD_DATA_DETAIL = "http://localhost:8011/leadData/updateLead";

const API_DELETE_LEAD_DATA_DETAIL = "http://localhost:8011/leadData/deleteLead";

// Interview
const API_FETCH_INTERVIEW_DETAILS = "http://localhost:8011/interviews/fetch-interviews";

const API_CREATE_INTERVIEW_DETAIL = "http://localhost:8011/interviews/create-interview";

const API_UPDATE_INTERVIEW_DETAIL = "http://localhost:8011/interviews/update-interview";

const API_DELETE_INTERVIEW_DETAIL = "http://localhost:8011/interviews/delete-interview";

// Reports

export {
    API_REGISTER_URL,
    API_LOGIN_URL,
    API_GET_REGISTERED_USERS,
    API_CHECK_REGISTERD_USERS,
    JWT_CREDINIALS,
    API_UPDATE_USER,
    API_USER_GOALS,
    API_ADD_STUDENT,
    API_GET_STUDENT,
    API_UPDATE_STUDENT,
    API_DELETE_STUDENT,
    API_ADD_EMPLOYEE,
    API_CONVERT_TO_EMPLOYEE,
    API_GET_EMPLOYEE,
    API_UPDATE_EMPLOYEE,
    API_DELETE_EMPLOYEE,
    API_ADD_ATTENDANCE,
    API_GET_ATTENDANCE,
    API_UPDATE_ATTENDANCE,
    API_DELETE_ATTENDANCE,
    API_ADD_CLIENT,
    API_GET_CLIENT,
    API_DELETE_CLIENT,
    API_CREATE_INVOICE,
    API_SHOW_INVOICES,
    API_DELETE_INVOICE,
    API_UPDATE_INVOICE,
    API_FETCH_COURSE,
    API_CREATE_COURSE,
    API_UPDATE_COURSE,
    API_DELETE_COURSE,
    API_FETCH_STUDENT_RECEIPT,
    API_CREATE_STUDENT_RECEIPT,
    API_UPDATE_STUDENT_RECEIPT,
    API_DELETE_STUDENT_RECEIPT,
    API_CREATE_CUSTOMER_RECEIPT,
    API_FETCH_CUSTOMER_RECEIPT,
    API_DELETE_CUSTOMER_RECEIPT,
    API_UPDATE_CUSTOMER_RECEIPT,
    API_FETCH_CASHOUT_RECEIPT,
    API_CREATE_CASHOUT_RECEIPT,
    API_UPDATE_CASHOUT_RECEIPT,
    API_DELETE_CASHOUT_RECEIPT,
    API_FETCH_VENDOR_DETAILS,
    API_CREATE_VENDOR_DETAIL,
    API_UPDATE_VENDOR_DETAIL,
    API_DELETE_VENDOR_DETAIL,
    API_FETCH_STAFF_DETAILS,
    API_CREATE_STAFF_DETAIL,
    API_UPDATE_STAFF_DETAIL,
    API_DELETE_STAFF_DETAIL,
    API_FETCH_LEAD_DETAILS,
    API_CREATE_LEAD_DETAIL,
    API_UPDATE_LEAD_DETAIL,
    API_DELETE_LEAD_DETAIL,
    API_CREATE_LEAD_DATA_DETAIL,
    API_FETCH_LEAD_DATA_DETAILS,
    API_UPDATE_LEAD_DATA_DETAIL,
    API_DELETE_LEAD_DATA_DETAIL,
    API_CREATE_INTERVIEW_DETAIL,
    API_FETCH_INTERVIEW_DETAILS,
    API_UPDATE_INTERVIEW_DETAIL,
    API_DELETE_INTERVIEW_DETAIL
}