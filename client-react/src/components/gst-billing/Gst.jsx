/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import "./gst.css"
import numberToWords from 'number-to-words';
import logoimg from "./assets/kitkat-removebg-preview.png"
import { showClients } from '../features/clientSlice';
import { createInvoice } from "../features/invoiceSlice"
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { formControlClasses } from '@mui/material';
const Gst = () => {

    const dispatch = useDispatch();
    // fetch client name from store
    useEffect(() => {
        dispatch(showClients());
    }, [dispatch]);
    useEffect(() => {
        const textarea = document.querySelector('.autogrow-input');
        if (textarea) {
            textarea.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }
    }, []);

    const kikatGstNo = "33BIQPA2943B1ZQ";
    const clientList = useSelector(state => state.clients.clientEntries);
    const [clientNameCurrent, setClientNameCurrent] = useState("");
    const [selectedClient, setSelectedClient] = useState({
        clientName: '',
        address: '',
        date: '',
        inVoice_no: '',
        phoneNumber: '',
        gst_in: '',
        productDetails: [],
        cgstAmount: '',
        sgstAmount: '',
        igstAmount: '',
        finalTotal: '',
        subTotal: '',
    });
    const [isPrint, setIsPrint] = useState(false);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const [newRow, setNewRow] = useState([
        { description: "", quantity: "", unitPrice: "", totalAmount: "0.00" },
    ]);
    const [isSaved, setIsSaved] = useState(false);
    // today date
    const currentDate = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = currentDate.toLocaleDateString('en-GB', options);
    // handle input changes to create new row in table
    const handleInputChanges = (e, index, entry) => {
        const { value } = e.target;
        const addRow = [...newRow];
        addRow[index][entry] = value;
        if (entry === "quantity" || entry === "unitPrice") {
            const quantity = parseFloat(addRow[index].quantity) || 0;
            const unitPrice = parseFloat(addRow[index].unitPrice) || 0;
            const totalAmount = (quantity * unitPrice);
            addRow[index].totalAmount = parseFloat(totalAmount);
        }
        const textarea = e.target;
        const textareaWidth = textarea.scrollWidth;
        if (textareaWidth > 100) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
        setNewRow(addRow);
    }
    const handleNewRow = () => {
        const tmpS_no = newRow.length + 1;
        setNewRow([
            ...newRow,
            {
                sno: tmpS_no,
                description: "",
                quantity: '',
                unitPrice: '',
                totalAmount: "0.00",
            }
        ]);
    };
    // save invoice
    const saveInvoice = () => {
        setSelectedClient(prevState => ({
            ...prevState,
            productDetails: []
        }))
        if (selectedClient.state === 'Tamil Nadu') {
            setSelectedClient(prevState => ({
                ...prevState,
                productDetails: [
                    ...(prevState.productDetails || []),
                    ...newRow.map((row, index) => ({
                        sno: index + 1,
                        description: row.description,
                        quantity: row.quantity,
                        unitPrice: row.unitPrice,
                        totalAmount: row.totalAmount
                    }))
                ],
                subTotal: totalSum(),
                cgstAmount: cgstAmount(),
                sgstAmount: sgstAmount(),
                finalTotal: finalTotalTamilNadu()
            }));
        } else {
            setSelectedClient(prevState => ({
                ...prevState,
                productDetails: [
                    ...(prevState.productDetails || []),
                    ...newRow.map((row, index) => ({
                        sno: index + 1,
                        description: row.description,
                        quantity: row.quantity,
                        unitPrice: row.unitPrice,
                        totalAmount: row.totalAmount
                    }))
                ],
                igstAmount: igstAmount(),
                finalTotal: finalTotal(),
            }));
        }

        postInvoiceDate(selectedClient);
        setIsSaved(true);
    };

    const handleDeleteRow = (index) => {
        const filteredRows = [...newRow];
        filteredRows.splice(index, 1);

        filteredRows.forEach((row, index) => {
            row.sno = index + 1
        })
        setNewRow(filteredRows);
    }

    const handleClientSelect = (e) => {
        const selectedClientName = e.target.value;
        setClientNameCurrent(selectedClientName);
        const client = clientList.find(client => client.clientName === selectedClientName);
        setSelectedClient(client);
    }
    const totalSum = () => {
        return newRow.reduce((acc, row) => acc + row.totalAmount, 0);
    }
    const igstAmount = () => {
        const totalAmount = newRow.reduce((acc, row) => acc + parseFloat(row.totalAmount), 0);
        return totalAmount * (18 / 100);
    }
    const sgstAmount = () => {
        return totalSum() * (9 / 100);
    }
    const cgstAmount = () => {
        return totalSum() * (9 / 100);
    }
    const finalTotal = () => {
        return parseFloat(totalSum()) + parseFloat(igstAmount());
    }
    const finalTotalTamilNadu = () => {
        return parseFloat(totalSum()) + parseFloat(sgstAmount()) + parseFloat(cgstAmount());
    }
    const finalTotalWords = numberToWords.toWords(finalTotal()).toUpperCase();

    const postInvoiceDate = (selectedClient) => {
        dispatch(createInvoice(selectedClient));
    }
    const printDunc = () => {
        setIsPrintClicked(true);
        saveInvoice();
        // dispatch(createInvoice(selectedClient));
        console.log("SELECTED CLIENT", selectedClient)
        window.print();

    }
    return (
        <div className='printGST_container'>
            <div className="bill_header_segment">
                <div className="segment_left">
                    <div className="bill_heading">
                        <h1 className='bill_heading_text'>INVOICE</h1>
                    </div>
                    <div className="bill_address">
                        <h2>KITKAT SOFTWARE TECHNOLOGIES</h2>
                        <p style={{ lineHeight: '1.5', fontWeight: "550" }}>
                            No: 70/77 , 1st Floor, Krishna complex, PN Palayam<br />
                            Coimbatore-641037 <br />
                            Phone No : 7010816299 , 04224957272.
                        </p>
                    </div>

                    <div className="bill_invoiceTo">
                        <h4 style={{ paddingTop: "8px" }}>INVOICE TO:</h4>
                        <div className="select-name" data-selected-option={clientNameCurrent} style={{ margin: "0", padding: "0" }}>
                            <select style={{ fontWeight: "bold" }} value={clientNameCurrent} onChange={handleClientSelect} name='emp_name'>
                                <option value="" style={{ width: "200px" }}>Select a Client</option>
                                {clientList.map(client => (
                                    <option key={client.id} value={client.clientName} style={{ width: "200px", margin: "0", padding: "0" }}>
                                        {client.clientName}
                                    </option>
                                ))}
                            </select>

                        </div>
                        <div className="client-detail" style={{ margin: "0", padding: "0" }}>
                            {selectedClient && (
                                <div style={{ width: "44.5%", margin: "0", padding: "0" }}>
                                    <p style={{ margin: "0", padding: "0" }}>{selectedClient.address}
                                        <br />
                                        {selectedClient.state}
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>GSTIN/UIN:</span>{selectedClient.gst_in}
                                    </p>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="segment-right">
                    <div className="logo-img">
                        <img src={logoimg} alt="logo" />
                    </div>
                    <div className="date-field">
                        <div className="date-field-heading">
                            <h5>DATE</h5>
                            <h5>INVOICE NO</h5>
                            <h5>GSTIN</h5>
                        </div>
                        <div className="date-field-details">
                            <h5>{formattedDate}</h5>
                            <h5>{selectedClient.inVoice_no}</h5>
                            <h5>{kikatGstNo}</h5>
                        </div>
                    </div>

                </div>
            </div>
            {
                selectedClient.state !== 'Tamil Nadu' ? (
                    <div className="table_gst">
                        {
                            isPrint ? (
                                <table className={isPrint ? "table-print" : "table_inputs"} style={{ display: isPrint ? "block" : "none", border: "1px solid red" }}>
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>DESCRIPTION</th>
                                            <th>QTY</th>
                                            <th>UNIT PRICE (INR) </th>
                                            <th>PRICE (INR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newRow.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.description}</td>
                                                <td>{row.quantity}</td>
                                                <td>{row.unitPrice}</td>
                                                <td>{row.totalAmount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (

                                <table className={isPrint ? "table_inputs" : "table-print"} style={{ display: isPrint ? "none" : "block", width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>DESCRIPTION</th>
                                            <th>QTY</th>
                                            <th>UNIT PRICE (INR) </th>
                                            <th>PRICE (INR)</th>
                                            <th className="print_remove">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ width: "100%" }}>
                                        {newRow.map((row, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>

                                                <td>
                                                    <textarea
                                                        name={`description${index}`}
                                                        value={row.description}
                                                        onChange={(e) => handleInputChanges(e, index, "description")}
                                                        className={isPrintClicked ? 'transparent-border' : ''}
                                                        style={{ width: "100%", resize: "none" }}
                                                    />

                                                </td>
                                                <td>
                                                    <input type="number" name={`quantity${index}`} value={row.quantity}
                                                        onChange={(e) => handleInputChanges(e, index, "quantity")}
                                                        style={{ textAlign: "center" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input type="number" name={`unitPrice${index}`} value={row.unitPrice}
                                                        onChange={(e) => handleInputChanges(e, index, "unitPrice")}
                                                        style={{ textAlign: "center" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input type="text" name={`totalAmount${index}`} value={row.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        onChange={(e) => handleInputChanges(e, index, "totalAmount")}
                                                        style={{ textAlign: "center" }}
                                                        readOnly

                                                    />
                                                </td>
                                                <td className="print_remove" style={{ textAlign: "center" }}>
                                                    {index === newRow.length - 1 ? (
                                                        <button className="btn btn-add" onClick={handleNewRow}>
                                                            <AddCircleIcon />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-remove"
                                                            onClick={() => handleDeleteRow(index)}
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="two-detail">
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='visible-cell'>Sub Total</td>
                                            <td className='visible-cell-border'>
                                                <input type="text" value={totalSum().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` INR`} readOnly style={{ color: "red" }} />
                                            </td>
                                            <td className='empty-cell'></td>
                                        </tr>
                                        <tr className="two-detail">
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='visible-cell'>IGST</td>
                                            <td className='visible-cell-border'>
                                                <input type="text" value={igstAmount().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` INR`} readOnly />
                                            </td>
                                            <td className='empty-cell'></td>
                                        </tr>
                                        <tr className="two-detail">
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='visible-cell'>TOTAL</td>
                                            <td className='visible-cell-border'>
                                                <input type="text" value={finalTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` INR`} readOnly style={{ color: "red" }} />
                                            </td>
                                            <td className='empty-cell'></td>
                                        </tr>

                                    </tbody>
                                </table>
                            )
                        }

                    </div>
                ) : (
                    <div className="table_gst">
                        {
                            isPrint ? (
                                <table className={isPrint ? "table-print" : "table_inputs"} style={{ display: isPrint ? "block" : "none", border: "1px solid red" }}>
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>DESCRIPTION</th>
                                            <th>QTY</th>
                                            <th>UNIT PRICE (INR) </th>
                                            <th>PRICE (INR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newRow.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.description}</td>
                                                <td>{row.quantity}</td>
                                                <td>{row.unitPrice}</td>
                                                <td>{row.totalAmount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (

                                <table className={isPrint ? "table_inputs" : "table-print"} style={{ display: isPrint ? "none" : "block", width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>DESCRIPTION</th>
                                            <th>QTY</th>
                                            <th>UNIT PRICE (INR) </th>
                                            <th>PRICE (INR)</th>
                                            <th className="print_remove">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ width: "100%" }}>
                                        {newRow.map((row, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <textarea
                                                        name={`description${index}`}
                                                        value={row.description}
                                                        onChange={(e) => handleInputChanges(e, index, "description")}
                                                        className={isPrintClicked ? 'transparent-border' : ''}
                                                        style={{ width: "100%", resize: "none" }}
                                                    />

                                                </td>
                                                <td>
                                                    <input type="number" name={`quantity${index}`} value={row.quantity}
                                                        onChange={(e) => handleInputChanges(e, index, "quantity")}
                                                    />
                                                </td>
                                                <td>
                                                    <input type="number" name={`unitPrice${index}`} value={row.unitPrice}
                                                        onChange={(e) => handleInputChanges(e, index, "unitPrice")}
                                                    />
                                                </td>
                                                <td>
                                                    <input type="text" name={`totalAmount${index}`} value={row.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        onChange={(e) => handleInputChanges(e, index, "totalAmount")}
                                                        style={{ textAlign: "center" }}
                                                        readOnly

                                                    />
                                                </td>
                                                <td className="print_remove" style={{ textAlign: "center" }}>
                                                    {index === newRow.length - 1 ? (
                                                        <button className="btn btn-add" onClick={handleNewRow}>
                                                            <AddCircleIcon />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-remove"
                                                            onClick={() => handleDeleteRow(index)}
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="two-detail">
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='visible-cell'>SUB TOTAL</td>
                                            <td className='visible-cell-border'>
                                                <input type="text"
                                                    name="subTotal"
                                                    value={totalSum().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` INR`}
                                                    style={{ color: "red" }}
                                                    readOnly />
                                            </td>
                                            <td className='empty-cell'></td>
                                        </tr>
                                        <tr className="two-detail">
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='visible-cell'>CGST 9%</td>
                                            <td className='visible-cell-border'>
                                                <input type="text"
                                                    name="cgstAmount"
                                                    value={cgstAmount().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` INR`}
                                                    style={{ color: "black" }}
                                                    readOnly />
                                            </td>
                                            <td className='empty-cell'></td>
                                        </tr>
                                        <tr className="two-detail">
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='visible-cell'>SGST 9%</td>
                                            <td className='visible-cell-border'>
                                                <input type="text"
                                                    name="sgstAmount"
                                                    value={sgstAmount().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` INR`}
                                                    style={{ color: "black" }}
                                                    readOnly />
                                            </td>
                                            <td className='empty-cell'></td>
                                        </tr>
                                        <tr className="two-detail">
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='empty-cell'></td>
                                            <td className='visible-cell'>TOTAL</td>
                                            <td className='visible-cell-border'>
                                                <input type="text" name="finalTotal" value={finalTotalTamilNadu().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` INR`} readOnly style={{ color: "red" }} />
                                            </td>
                                            <td className='empty-cell'></td>
                                        </tr>
                                    </tbody>
                                </table>
                            )
                        }

                    </div>
                )
            }

            <div className='money_in_words'>
                <p style={{ fontSize: "1rem" }}>
                    <span style={{ fontSize: "1rem" }}>Total (In Words) : </span>
                    &emsp;
                    {finalTotalWords}
                </p>
            </div>

            <div className="bank-details">
                <div className="details">
                    <h2>Bank Account Details</h2>
                    <div className="bank-details-elements">
                        <div className="bank-elements-title">
                            <p>Name</p>
                            <p>Bank</p>
                            <p>Account No</p>
                            <p>IFSC Code</p>
                            <p>Branch</p>
                        </div>
                        <div className="bank-elements-colon">
                            <p>:</p>
                            <p>:</p>
                            <p>:</p>
                            <p>:</p>
                            <p>:</p>
                        </div>
                        <div className="bank-elements-data">
                            <p>Kitkat Software Technologies</p>
                            <p>Federal Bank</p>
                            <p>19829200003697</p>
                            <p>FDRL0001982</p>
                            <p>Papanaickenpalayam</p>
                        </div>
                    </div>
                </div>
                <div className="print-submit">
                    <button onClick={saveInvoice} className={`print-btn ${isPrintClicked ? 'clicked' : ''}`}>Save</button>
                    {
                        isSaved ? (
                            <button onClick={printDunc} className={`print-btn ${isPrintClicked ? 'clicked' : ''}`}>Print</button>
                        ) :
                            (
                                <button disabled className='print-btn-disable'>Print</button>
                            )
                    }
                </div>
            </div>
            <div className='thank-div'><h2>THANK YOU FOR YOU BUSINESS!</h2></div>
        </div>
    )
}

export default Gst

