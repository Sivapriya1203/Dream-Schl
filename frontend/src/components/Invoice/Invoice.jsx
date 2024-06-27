import React from 'react';
import { useLocation } from 'react-router-dom';
import './Invoice.css';
import logo from '../../assets/images/icons/logo.png';
import moment from 'moment';

const Invoice = () => {
  const location = useLocation();
  const { data } = location.state;
  console.log("Data :",data)

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice">
      <div className="invoice-container">
        <header className="invoice-header">
          <div className="school-logo">
            <img src={logo} alt="School Logo" />
          </div>
          <div className="school-details">
            <h2>DREAM PUBLIC SCHOOL</h2>
            <p>English Medium School For Girls</p>
            <p>Bh. Royal Appartments, Junigadhi, Vadodara, Gujarat-390006</p>
            <p>Phone No: (123) 456-7890</p>
          </div>
          <div className="receipt-details">
          <p>Receipt Date: {moment().format("YYYY-MM-DD")}</p>
{data.map((item, index) => (
  <div key={index}>
    <p>Student Name: {item.stu_name}</p>
    <p>Roll Number: {item.roll_no}</p>
    <p>Class : {item.cls_name}</p>
    <p>Section : {item.sec_name}</p>
  </div>
))}

          </div>
        </header>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>ITEM #</th>
              <th>ITEM DESCRIPTION</th>
              <th>PAID AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.fee_category}</td>
                <td>{Number(item.paid_amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <div className="summary-details">
            <p>Total Fees Paid: {data.reduce((total, item) => total + Number(item.paid_amount), 0).toFixed(2)}</p>
          </div>
        </div>

        <footer>
          <p>This is a computer generated receipt and does not require a signature.</p>
        </footer>
      </div>
      <div className="print-button">
        <button onClick={handlePrint}>Print</button>
      </div>
    </div>
  );
};

export default Invoice;
