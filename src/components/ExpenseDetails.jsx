import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { MdFileDownload } from 'react-icons/md';

const ExpenseDetails = () => {
    const params = useParams()
    const userId = window.atob(Cookies.get("usrin"));
    const pageRender = useNavigate()

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ cash_flow_name: '', category: '', cash_flow_type: 'IN', amount: '' });
    const [modalTitle, setModalTitle] = useState('Credit Entry');
    const [loadCashDetails, setLoadCashDetails] = useState({})

    useEffect(() => {
        fetchCashFlowDetails()
    }, [])

    const fetchCashFlowDetails = async () => {
        if (userId && params.id) {
            try {
                const res = await axios.post('https://truck.truckmessage.com/initial_cash_in_out', { load_trip_id: params.id })
                if (res.data.error_code === 0) {
                    setLoadCashDetails(res.data.data.length > 0 ? res.data.data : [])
                }

                const response = await axios.post('https://truck.truckmessage.com/get_load_trip_cash_flow', {
                    user_id: userId,
                    load_trip_id: params.id
                });

                const fetchedData = response.data.data.map(item => ({
                    date: new Date(item.updt).toLocaleDateString(),
                    total: item.amount,
                    spend: item.cash_flow_type === 'OUT' ? item.amount : 0,
                    balance: item.closing_balance,
                    transactions: [
                        {
                            reason: item.cash_flow_name,
                            description: item.category,
                            debitorcredit: item.cash_flow_type === 'IN' ? 'credit' : 'debit',
                            rupees: item.amount,
                            time: new Date(item.updt).toLocaleString()
                        }
                    ]
                }));

                // Group transactions by date
                const groupedData = fetchedData.reduce((acc, current) => {
                    if (!acc[current.date]) {
                        acc[current.date] = {
                            date: current.date,
                            total: current.total,
                            spend: current.spend,
                            balance: current.balance,
                            transactions: []
                        };
                    }
                    acc[current.date].transactions.push(...current.transactions);
                    return acc;
                }, {});

                setData(Object.values(groupedData));
                setForm({ cash_flow_name: '', category: '', cash_flow_type: 'IN', amount: '', description: '' })
            } catch (error) {
                console.error('Error fetching cash flow details:', error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }
    };

    const downloadCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";

        csvContent += "truckmessage\n";

        csvContent += "\n";


        // csvContent += "Total Credit,Total Debit,Available Balance\n";


        // csvContent += `${entry.load_name || 'N/A'},${totalCredit},${totalDebit},${entry.balance}\n`;

        csvContent += "Date,Current Balance,S.no,Description,Debit/Credit,Rupees,Time,Load Name\n";


        data.forEach(entry => {
            entry.transactions.forEach((transaction, index) => {
                let row = [
                    entry.date,
                    entry.balance,
                    index + 1,
                    transaction.reason,
                    transaction.debitorcredit,
                    transaction.rupees,
                    transaction.time
                ].join(","); // Join values by comma
                csvContent += row + "\n"; // Add new line
            });
        });

        // Create a downloadable link and trigger the download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "truckmessage.csv");
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://truck.truckmessage.com/load_trip_cash_flow_entry', {
                load_trip_id: params.id,
                ...form
            });
            if (res.data.error_code === 0) {
                fetchCashFlowDetails(); // Refresh the data after submission
                document.getElementById("closeExpenseCalculatorModel").click()
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleModalOpen = (type) => {
        setModalTitle(type === 'IN' ? 'Credit Entry' : 'Debit Entry');
        setForm({ ...form, cash_flow_type: type });
    };

    if (loading) return <div className='text-center m-3'>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <section>
            <div className="ltn__page-details-area ltn__service-details-area mb-105">
                <div className="container py-2">
                    <div className='my-4 row d-flex justify-content-between align-items-center'>
                        <button type='button' className='btn btn-transparent border shadow-none col-12 col-md-4 col-lg-2 col-xl-1' onClick={() => pageRender('/expense-calculator')}>
                            <IoChevronBackCircleOutline className='me-2' />
                            Back
                        </button>
                        <button className="btn btn-primary mt-3 col-12 col-md-6 col-lg-4 col-xl-2" onClick={downloadCSV}>
                            <MdFileDownload className='me-2' />
                            Download report
                        </button>
                    </div>

                    <div className="row shadow">
                        <div className="card w-100 shadow">
                            <div className="card-body">
                                <div className="col-12 mb-3 row py-3 text-center">
                                    <div className="col-4">
                                        <p className="card-text mb-1">
                                            <b>Total Credit:</b>
                                            <span className='ps-2'>{loadCashDetails[0].load_price}</span>
                                        </p>
                                    </div>
                                    <div className="col-4">
                                        <p className="card-text mb-1">
                                            <b>Available amount :</b>
                                            <span className='ps-2'>{loadCashDetails[0].available_cash}</span>
                                        </p>
                                    </div>
                                    <div className="col-4">
                                        <p className="card-text mb-1">
                                            <b>Total Debit:</b>
                                            <span className='ps-2'>{loadCashDetails[0].spend_amount}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center mt-3 mb-5  gap-2">
                                    <button type="button" className="btn btn-success p-2 h-100" data-bs-toggle="modal" data-bs-target="#modalForm" onClick={() => handleModalOpen('IN')}>Credit</button>
                                    <button type="button" className="btn btn-danger p-2" data-bs-toggle="modal" data-bs-target="#modalForm" onClick={() => handleModalOpen('OUT')}>Debit</button>
                                </div>

                                <div className="col-12 p-0 mt-3">
                                    <div className="border rounded p-3">
                                        {data.map((entry, index) => (
                                            <div className='border-bottom' key={index}>
                                                <div className="row">
                                                    <div className="col-12 col-lg-12">
                                                        <h5 className='mt-2'>{entry.date}</h5>
                                                        <p className="card-text mb-1">
                                                            <b>Current balance :</b>
                                                            <span className='ps-2'>{entry.balance}</span>
                                                        </p>
                                                    </div>
                                                    <div className="col-12 col-lg-12 overflow-scroll tableScrollbar">
                                                        <table className="table col-12  table-striped table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">S.no</th>
                                                                    <th scope="col">Description</th>
                                                                    <th scope="col">Debit/Credit</th>
                                                                    <th scope="col">Rupees</th>
                                                                    <th scope="col">Time</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {entry.transactions.map((transaction, index) => (
                                                                    <tr key={index}>
                                                                        <th scope="row">{index + 1}</th>
                                                                        <td>{transaction.reason}</td>
                                                                        <td>{transaction.debitorcredit}</td>
                                                                        <td className={`${transaction.debitorcredit === "credit" ? "text-success" : "text-danger"}`}>{transaction.rupees}</td>
                                                                        <td>{transaction.time}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Button to download CSV */}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Modal Form */}
            <div className="modal fade" id="modalForm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeExpenseCalculatorModel" aria-label="Close" onClick={() => setForm({ cash_flow_name: '', category: '', cash_flow_type: 'IN', amount: '', description: '' })}></button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>Description</h5>
                                        <div className="input-item input-item-name">
                                            <input
                                                type="text"
                                                name="cash_flow_name"
                                                value={form.cash_flow_name}
                                                onChange={handleFormChange}
                                                placeholder="Enter your trip name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <h5>Reason</h5>
                                        <div className="input-item input-item-name">
                                            <select
                                                className="nice-select ltn__custom-icon"
                                                name="category"
                                                value={form.category}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="Petrol">Petrol</option>
                                                <option value="Diesel">Diesel</option>
                                                <option value="Food">Food</option>
                                                <option value="Tea">Tea</option>
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="row">
                                    {/* <div className="col-md-12">
                                        <h5>Description</h5>
                                        <div className="input-item input-item-name">
                                            <input
                                                type="text"
                                                name="description"
                                                value={form.description}
                                                onChange={handleFormChange}
                                                placeholder="Enter your Details"
                                                required
                                            />
                                        </div>
                                    </div> */}
                                    <div className="col-md-12">
                                        <h5>Amount</h5>
                                        <div className="input-item input-item-name">
                                            <input
                                                type="number"
                                                name="amount"
                                                value={form.amount}
                                                onChange={handleFormChange}
                                                placeholder="Enter your Amount"
                                                required
                                                className='w-100 py-3'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Add</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setForm({ cash_flow_name: '', category: '', cash_flow_type: 'IN', amount: '', description: '' })}>Close</button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpenseDetails;
