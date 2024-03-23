import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReceipts } from '../features/studentReceiptSlice';

const ReportStudent = () => {
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const dispatch = useDispatch();
    const receipts = useSelector(state => state.studentReceipts.studentReceiptEntries);

    useEffect(() => {
        dispatch(getReceipts());
    }, [dispatch]);
    useEffect(() => {
        localStorage.setItem("ReceiptStudentTotal--", receipts)
    }, [receipts])

    useEffect(() => {
        if (receipts) {
            // Calculate total paid amount
            let totalAmount = 0;
            receipts.forEach(receipt => {
                totalAmount += parseFloat(receipt.paidAmount);
            });
            setTotalPaidAmount(totalAmount);
        }
    }, [receipts]);


    return (
        <div>
            <h1>Report for Student Receipts</h1>
            <h2>Total Paid Amount: {totalPaidAmount}</h2>
        </div>
    );
};

export default ReportStudent;
