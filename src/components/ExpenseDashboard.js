import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ExpenseDashboard = ({ transactions, totalBalance, income, expense, deleteTransaction }) => {
  const [view, setView] = useState('day'); // 'day' or 'week'

  // this function groups your transactions so the graph understands them
  const chartData = useMemo(() => {
    const dataMap = {};

    transactions.forEach(t => {
      // only track expenses (negative numbers) for the graph
      if (t.amount >= 0) return;

      const date = new Date(t.date);
      let key;

      if (view === 'day') {
        // group by "Mon", "Tue", etc.
        key = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        // group by "Week 1", etc. (simplified for now)
        // this gets the start of the week
        const firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
        key = firstDay.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      }

      // add the positive value of the expense (flip -20 to 20)
      if (!dataMap[key]) dataMap[key] = 0;
      dataMap[key] += Math.abs(t.amount);
    });

    // convert the object back to an array for recharts
    return Object.keys(dataMap).map(key => ({
      name: key,
      amount: dataMap[key]
    }));
  }, [transactions, view]);

  return (
    <div className="bg-gray-100 p-6 font-sans text-gray-800 rounded-lg">

      {/* header section */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">dashboard</h1>
          <p className="text-gray-500 text-sm">track your cash</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
          <span className="text-gray-400 text-xs uppercase tracking-wide">current balance</span>
          <div className={`text-xl font-bold ${totalBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
            ${totalBalance}
          </div>
        </div>
      </header>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* left column: charts & list */}
        <div className="lg:col-span-2 space-y-6">

          {/* CHART CARD */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">spending analytics</h2>
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${view === 'day' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                >
                  daily
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${view === 'week' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                >
                  weekly
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      dy={10}
                    />
                    <Tooltip
                      cursor={{ fill: '#F3F4F6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#6366f1" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed">
                  add some expenses to see the graph
                </div>
              )}
            </div>
          </div>

          {/* recent transactions list */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">history</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {transactions.length === 0 && <p className="text-gray-400 text-sm">no transactions yet.</p>}

              {transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${t.amount < 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <div>
                      <p className="font-medium">{t.text}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="text-gray-400 hover:text-red-500 text-sm font-bold px-2"
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right column: stats */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <p className="text-xs text-green-600 uppercase font-bold">income</p>
              <p className="text-xl font-bold text-green-700">+${income}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="text-xs text-red-600 uppercase font-bold">expense</p>
              <p className="text-xl font-bold text-red-700">-${expense}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpenseDashboard;