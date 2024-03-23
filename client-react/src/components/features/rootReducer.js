import { combineReducers } from "redux";
import registerDetail from "./registerDetailSlice";
import loginDetail from "./loginUserSlice";
import students from "./studentsSlice";
import employees from "./employeesSlice";
import attendance from "./attendanceSlice";
import clients from "./clientSlice";
import invoices from "./invoiceSlice";
import courses from "./courseSlice";
import studentReceipts from "./studentReceiptSlice";
import customerReceipts from "./customerReceiptSlice";
import cashoutReceipts from "./cashoutReceiptsSlice";
import vendorDetails from "./vendorDetailsSlice";
import staffDetails from "./staffSlice";
import leadDetails from "./leadSlice";
import leadExcelDetails from "./leadExcelSlice";
const rootReducer = combineReducers({
    user: registerDetail,
    loginDetail: loginDetail,
    students: students,
    employees: employees,
    attendance: attendance,
    clients: clients,
    invoices: invoices,
    courses: courses,
    studentReceipts: studentReceipts,
    customerReceipts: customerReceipts,
    cashoutReceipts: cashoutReceipts,
    vendorDetails: vendorDetails,
    staffDetails: staffDetails,
    leadDetails: leadDetails,
    leadExcelDetails: leadExcelDetails,
});

export default rootReducer;