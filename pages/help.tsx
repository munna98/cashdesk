// Help.tsx
import Layout from "@/components/layout/Layout"
import { useState } from "react"

export default function Help() {
  const [activeSection, setActiveSection] = useState<string | null>("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    alert("Your message has been sent. We'll get back to you shortly!")
    setFormData({ name: "", email: "", subject: "", message: "" })
    setShowContactForm(false)
  }

  const faqSections = {
    general: [
      {
        question: "What is Cash Desk App?",
        answer: "Cash Desk App is a comprehensive solution for managing cash transactions, agent commissions, and financial reporting for businesses that handle multiple agents and cash-based operations."
      },
      {
        question: "How do I get started with Cash Desk App?",
        answer: "After logging in, you'll be taken to the Dashboard where you can see a summary of today's transactions. To add a new transaction, navigate to the Transactions page and click the 'Add New' button."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we use industry-standard encryption and security practices to ensure your financial data remains secure and private at all times."
      }
    ],
    transactions: [
      {
        question: "How do I record a new receipt?",
        answer: "Navigate to the Receipts section, click 'Add New Receipt', fill in the required details including the agent, amount, and commission, then save the transaction."
      },
      {
        question: "Can I edit a transaction after it's been recorded?",
        answer: "Yes, you can edit transactions by finding them in the transaction list and clicking the edit button. Note that all changes are logged for auditing purposes."
      },
      {
        question: "How do I handle refunds or corrections?",
        answer: "For refunds, create a new payment transaction and mark it as a refund. For corrections, you can edit the original transaction if it's from the current day, or create adjustment entries."
      }
    ],
    agents: [
      {
        question: "How do I add a new agent?",
        answer: "Go to the Agents section, click 'Add New Agent', fill in their details including name, contact information, and commission rate, then save."
      },
      {
        question: "How are commissions calculated?",
        answer: "Commissions are automatically calculated based on the commission rate set for each agent and the transaction amount. You can view commission summaries in the Agents section or detailed reports."
      },
      {
        question: "Can I set different commission rates for different transaction types?",
        answer: "Yes, you can configure variable commission rates for each agent based on transaction types, amounts, or other criteria in the Agent Settings."
      }
    ],
    reports: [
      {
        question: "How do I generate a daily summary report?",
        answer: "Go to the Reports section, select 'Daily Summary', choose the date, and click 'Generate Report'. You can then view, download, or print the report."
      },
      {
        question: "Can I export reports to Excel or PDF?",
        answer: "Yes, all reports can be exported to Excel, PDF, or CSV formats by clicking the 'Export' button at the top of any report view."
      },
      {
        question: "How do I see commission totals for a specific period?",
        answer: "Navigate to Reports > Commission Summary, select your date range and optional agent filter, then generate the report to see detailed commission breakdowns."
      }
    ]
  }

  const allFaqs = Object.values(faqSections).flat()
  
  const filteredFaqs = searchQuery 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Help Center
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="form-input block w-full py-3 px-4 pr-10 rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-10 bg-white shadow overflow-hidden sm:rounded-md">
            <div className="bg-gray-50 px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Search Results
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <li key={index} className="px-4 py-5 sm:px-6">
                    <h4 className="text-lg font-medium text-gray-900">{faq.question}</h4>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 sm:px-6 text-gray-500">
                  No results found. Please try a different search term or contact support.
                </li>
              )}
            </ul>
          </div>
        )}

        {!searchQuery && (
          <>
            {/* Quick Links */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
              <button
                onClick={() => setActiveSection("general")}
                className={`p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors ${
                  activeSection === "general" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <svg className="h-8 w-8 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="mt-2 block text-sm font-medium">General Help</span>
              </button>
              
              <button
                onClick={() => setActiveSection("transactions")}
                className={`p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors ${
                  activeSection === "transactions" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <svg className="h-8 w-8 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="mt-2 block text-sm font-medium">Transactions</span>
              </button>
              
              <button
                onClick={() => setActiveSection("agents")}
                className={`p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors ${
                  activeSection === "agents" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <svg className="h-8 w-8 mx-auto text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="mt-2 block text-sm font-medium">Agents</span>
              </button>
              
              <button
                onClick={() => setActiveSection("reports")}
                className={`p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors ${
                  activeSection === "reports" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <svg className="h-8 w-8 mx-auto text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="mt-2 block text-sm font-medium">Reports</span>
              </button>
            </div>

            {/* FAQ Accordion */}
            {activeSection && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
                <div className="bg-gray-50 px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Frequently Asked Questions
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {activeSection === "general" && "Basic information about Cash Desk App"}
                    {activeSection === "transactions" && "Help with recording and managing transactions"}
                    {activeSection === "agents" && "Information about agent management and commissions"}
                    {activeSection === "reports" && "Guidance on generating and interpreting reports"}
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {faqSections[activeSection as keyof typeof faqSections].map((faq, index) => (
                    <div key={index} className="px-4 py-5 sm:px-6">
                      <h4 className="text-lg font-medium text-gray-900">{faq.question}</h4>
                      <p className="mt-2 text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Contact Options */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Still need help?</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Call Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our support team is available Monday through Friday, 9AM to 6PM IST.
              </p>
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-600">+91 8086094070</span>
                <a 
                  href="tel:+918086094070" 
                  className="inline-flex items-center px-3 py-2 border border-blue-600 text-sm leading-4 font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Call Now
                </a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Email Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Send us a detailed message and we'll get back to you within 24 hours.
              </p>
              <button 
                onClick={() => setShowContactForm(!showContactForm)} 
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {showContactForm ? "Hide Form" : "Contact Us"}
              </button>
            </div>
          </div>
          
          {/* Contact Form */}
          {showContactForm && (
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Send us a message</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.name}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.subject}
                      onChange={handleFormChange}
                    >
                      <option value="">Select a subject</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Account Question">Account Question</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.message}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
      </div>
    </Layout>
  )
}