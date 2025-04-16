import { useState } from 'react';
import { CalendarIcon, ArrowDownIcon, FolderPlusIcon, ChartPieIcon, ChartBarIcon, ArrowRightIcon, PauseCircleIcon } from '@heroicons/react/24/outline'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('month');
  const [selectedAccount, setSelectedAccount] = useState('all');

  const recentTransactions = [
    { id: 1, date: '2025-04-15', account: 'Main Cash', description: 'Sales Revenue', amount: 2450.00, type: 'credit' },
    { id: 2, date: '2025-04-14', account: 'Expenses', description: 'Office Supplies', amount: 125.30, type: 'debit' },
    { id: 3, date: '2025-04-12', account: 'Sales Tax', description: 'Tax Payment', amount: 420.75, type: 'debit' },
    { id: 4, date: '2025-04-10', account: 'Main Cash', description: 'Customer Payment', amount: 1350.00, type: 'credit' },
  ];

  const accountSummary = [
    { name: 'Main Cash', balance: 12450.75, change: '+8.5%' },
    { name: 'Expenses', balance: -2340.55, change: '+2.3%' },
    { name: 'Sales Tax', balance: 1845.20, change: '+15.2%' },
    { name: 'Payroll', balance: -3250.00, change: '-5.1%' }
  ];

  const chartData = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 2800 },
    { name: 'Mar', income: 5000, expenses: 3200 },
    { name: 'Apr', income: 4500, expenses: 2900 },
    { name: 'May', income: 6000, expenses: 3500 },
    { name: 'Jun', income: 5500, expenses: 3700 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
              <select 
                className="bg-transparent text-gray-700 focus:outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowDownIcon className="h-5 w-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-6 px-6">
        <div className="flex border-b">
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'ledger' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('ledger')}
          >
            Ledger Reports
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'transactions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transaction Analysis
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'summary' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('summary')}
          >
            Financial Summary
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Income</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">$24,530.80</h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ChartPieIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-sm font-medium text-green-600">+12.5%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">$15,245.65</h3>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-sm font-medium text-red-600">+8.2%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Net Balance</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">$9,285.15</h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-sm font-medium text-blue-600">+4.3%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transactions</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">435</h3>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PauseCircleIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-sm font-medium text-purple-600">+6.8%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-800">Income vs Expenses</h3>
                <div className="h-64 mt-4 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full p-4">
                    {/* Simplified placeholder for chart */}
                    <div className="h-full w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative">
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
                        {chartData.map((item, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className="relative">
                              <div 
                                className="w-8 bg-blue-500 rounded-t-sm" 
                                style={{ height: `${item.income/100}px` }}
                              ></div>
                              <div 
                                className="w-8 bg-red-400 rounded-t-sm absolute -right-10" 
                                style={{ height: `${item.expenses/100}px` }}
                              ></div>
                            </div>
                            <span className="text-xs mt-2 text-gray-500">{item.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-center text-gray-400 text-sm">Income/Expense Chart</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-800">Account Balance Trends</h3>
                <div className="h-64 mt-4 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full p-4">
                    {/* Simplified placeholder for chart */}
                    <div className="h-full w-full bg-gradient-to-r from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400 text-sm">Account Balance Trend Chart</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Recent Transactions</h3>
                <button className="text-sm text-blue-600 flex items-center">
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{transaction.account}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{transaction.description}</td>
                        <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Account Summary</h3>
                <button className="text-sm text-blue-600 flex items-center">
                  View Details
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {accountSummary.map((account, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-800">{account.name}</p>
                    <p className={`text-xl font-bold mt-2 ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(account.balance).toFixed(2)}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs font-medium ${account.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {account.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">this month</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800">Ledger Accounts</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select 
                    className="appearance-none bg-gray-100 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    <option value="all">All Accounts</option>
                    <option value="cash">Main Cash</option>
                    <option value="expenses">Expenses</option>
                    <option value="taxes">Sales Tax</option>
                    <option value="payroll">Payroll</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                </div>
                <button className="bg-gray-100 p-2 rounded-lg">
                  <FolderPlusIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <ArrowDownIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Debit</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Credit</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Main Cash</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">1001</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Asset</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$18,450.00</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$5,999.25</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">$12,450.75</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Expenses</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">2001</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Expense</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$2,340.55</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$0.00</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">-$2,340.55</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Sales Tax</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">3001</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Liability</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$420.75</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$2,265.95</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">$1,845.20</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Payroll</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">4001</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Expense</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$3,250.00</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$0.00</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">-$3,250.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    {/* <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-800">Total</td> */}
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">Total</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">$24,461.30</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">$8,265.20</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">$8,705.40</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Transaction Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400 text-sm">Transaction by Category Chart</div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400 text-sm">Transaction Volume Chart</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Transaction Breakdown</h3>
                <div className="flex space-x-3">
                  <div className="relative">
                    <select className="appearance-none bg-gray-100 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>By Category</option>
                      <option>By Account</option>
                      <option>By Date</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Sales</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">125</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-600">$15,340.00</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$122.72</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">62.5%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Supplies</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">43</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-red-600">-$1,250.45</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$29.08</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">5.1%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Payroll</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">12</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-red-600">-$6,450.00</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$537.50</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">26.3%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Utilities</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">8</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-red-600">-$1,485.20</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$185.65</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">6.1%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Income Statement</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <span className="text-sm font-medium text-gray-800">$24,530.80</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Cost of Goods Sold</span>
                      <span className="text-sm font-medium text-gray-800">$8,745.30</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Gross Profit</span>
                      <span className="text-sm font-medium text-green-600">$15,785.50</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Operating Expenses</span>
                      <span className="text-sm font-medium text-gray-800">$6,500.35</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Net Income</span>
                      <span className="text-sm font-medium text-green-600">$9,285.15</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-sm text-gray-600">Profit Margin</span>
                      <span className="text-sm font-medium text-blue-600">37.9%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Balance Sheet Summary</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Total Assets</span>
                      <span className="text-sm font-medium text-gray-800">$42,350.75</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Total Liabilities</span>
                      <span className="text-sm font-medium text-gray-800">$12,845.20</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Equity</span>
                      <span className="text-sm font-medium text-green-600">$29,505.55</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Current Ratio</span>
                      <span className="text-sm font-medium text-blue-600">2.4</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">Debt to Equity</span>
                      <span className="text-sm font-medium text-blue-600">0.44</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-sm text-gray-600">Return on Assets</span>
                      <span className="text-sm font-medium text-blue-600">21.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Cash Flow Summary</h3>
                <div className="flex space-x-3">
                  <button className="text-sm text-blue-600 flex items-center">
                    View Details
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Operating Activities</h4>
                  <p className="text-2xl font-bold text-blue-600">$12,480.50</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs font-medium text-green-600">+8.2%</span>
                    <span className="text-xs text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Investing Activities</h4>
                  <p className="text-2xl font-bold text-red-600">-$5,750.00</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs font-medium text-red-600">+12.5%</span>
                    <span className="text-xs text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Financing Activities</h4>
                  <p className="text-2xl font-bold text-green-600">$2,150.00</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs font-medium text-green-600">+4.3%</span>
                    <span className="text-xs text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 mb-4">Cash Flow Statement</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Period</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Period</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Beginning Cash Balance</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$18,450.25</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$15,320.80</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-600">+$3,129.45</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Net Cash from Operations</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$12,480.50</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$11,540.25</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-600">+$940.25</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Net Cash from Investing</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">-$5,750.00</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">-$5,110.50</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-red-600">-$639.50</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Net Cash from Financing</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$2,150.00</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">$2,060.70</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-600">+$89.30</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Ending Cash Balance</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-bold text-blue-600">$27,330.75</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-800">$23,811.25</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">+$3,519.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Performance Metrics</h3>
                <div className="flex space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <ArrowDownIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-blue-600">ROI</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">24.5%</p>
                  <p className="text-sm text-gray-500 mt-1">Return on Investment</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-green-600">GPM</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">64.3%</p>
                  <p className="text-sm text-gray-500 mt-1">Gross Profit Margin</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-purple-600">NPM</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">37.9%</p>
                  <p className="text-sm text-gray-500 mt-1">Net Profit Margin</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-yellow-600">OER</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">26.5%</p>
                  <p className="text-sm text-gray-500 mt-1">Operating Expense Ratio</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer with Export Options */}
      <footer className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Export Reports</h4>
            <p className="text-xs text-gray-500 mt-1">ArrowDownIcon reports in various formats</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowDownIcon className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowDownIcon className="h-4 w-4 mr-2" />
              CSV
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowDownIcon className="h-4 w-4 mr-2" />
              Excel
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <FolderPlusIcon className="h-4 w-4 mr-2" />
              Custom Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}