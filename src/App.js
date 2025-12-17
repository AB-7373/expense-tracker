import React, { useState, useEffect } from 'react';
import './App.css'; 
import ExpenseDashboard from './components/ExpenseDashboard';

function App() {
  // 1. load data from local storage on startup
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expense-tracker-data');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(''); // new state for date

  // 2. save to local storage whenever transactions change
  useEffect(() => {
    localStorage.setItem('expense-tracker-data', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if(!text || !amount) return;

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text: text,
      amount: +amount,
      // use the picked date, or default to today if empty
      date: date ? new Date(date) : new Date() 
    };

    setTransactions([...transactions, newTransaction]);
    setText('');
    setAmount('');
    setDate(''); // reset date
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // calculations
  const amounts = transactions.map(t => t.amount);
  const balance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Dashboard Component */}
        <ExpenseDashboard 
          transactions={transactions}
          totalBalance={balance}
          income={income}
          expense={expense}
          deleteTransaction={deleteTransaction}
        />

        {/* Add Transaction Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-lg mx-auto">
          <h3 className="text-lg font-bold mb-4 text-gray-800">add new transaction</h3>
          <form onSubmit={addTransaction} className="space-y-4">
            
            {/* Description */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">description</label>
              <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="e.g. chipotle" 
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Amount & Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">amount <span className="text-xs text-gray-400">(- for expense)</span></label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="-20" 
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* NEW DATE PICKER */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
                />
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-bold">
              add transaction
            </button>
          </form>
        </div>
                    <footer className="mt-12 text-center text-gray-500 text-sm pb-8">
          made by <a href="https://github.com/AB-7373" className="text-indigo-500 hover:text-indigo-600 font-bold" target="_blank" rel="noreferrer">AB-7373</a>
        </footer>

      </div>
    </div>
  );
}

export default App;
