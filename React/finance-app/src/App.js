import React, { useState, useEffect } from 'react';
import api from './api';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: ''
  });

  // Fetch all transactions from the API
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  // UseEffect to fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle form input changes
  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.post('/transactions/', formData);
      fetchTransactions(); // Refresh the transactions list
      // Reset form after submission
      setFormData({
        amount: '',
        category: '',
        description: '',
        is_income: false,
        date: ''
      });
    } catch (error) {
      console.error('Error creating transaction:', error.message);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Finance App
          </a>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container mt-4">
        {/* Transaction Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              onChange={handleInputChange}
              value={formData.amount}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              onChange={handleInputChange}
              value={formData.category}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={handleInputChange}
              value={formData.description}
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="is_income"
              name="is_income"
              onChange={handleInputChange}
              checked={formData.is_income}
            />
            <label htmlFor="is_income" className="form-check-label">
              Is Income?
            </label>
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              onChange={handleInputChange}
              value={formData.date}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        {/* Transactions Table */}
        <div className="mt-5">
          <h3>Transactions</h3>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Income?</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.amount}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.is_income ? 'Yes' : 'No'}</td>
                  <td>{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
