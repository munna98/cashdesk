// // pages/reports/report.tsx
// import { useState } from "react";
// import Layout from "@/components/layout/Layout";
// import DailySummaryReport from "@/components/reports/DailySummaryReport";
// import AgentSummaryReport from "@/components/reports/AgentSummaryReport";
// import TransactionRegisterReport from "@/components/reports/TransactionRegisterReport";
// import CommissionReport from "@/components/reports/CommissionReport";
// import {
//   DocumentTextIcon,
//   ChartBarIcon,
//   UserGroupIcon,
//   BanknotesIcon,
//   CalendarIcon,
//   ArrowDownTrayIcon,
// } from "@heroicons/react/24/outline";

// type ReportType = 
//   | "daily-summary"
//   | "agent-summary"
//   | "transaction-register"
//   | "commission-report"
//   | null;

// interface ReportCard {
//   id: ReportType;
//   title: string;
//   description: string;
//   icon: any;
//   color: string;
// }

// const reportCards: ReportCard[] = [
//   {
//     id: "daily-summary",
//     title: "Daily Summary Report",
//     description: "View daily opening, closing, receipts, payments, and commissions",
//     icon: CalendarIcon,
//     color: "blue",
//   },
//   {
//     id: "agent-summary",
//     title: "Agent Summary Report",
//     description: "Detailed agent-wise transaction summary with balances",
//     icon: UserGroupIcon,
//     color: "purple",
//   },
//   {
//     id: "transaction-register",
//     title: "Transaction Register",
//     description: "Complete list of all transactions with filters",
//     icon: DocumentTextIcon,
//     color: "green",
//   },
//   {
//     id: "commission-report",
//     title: "Commission Analysis",
//     description: "Agent-wise commission earned over a period",
//     icon: BanknotesIcon,
//     color: "yellow",
//   },
// ];

// export default function ReportsPage() {
//   const [selectedReport, setSelectedReport] = useState<ReportType>(null);

//   const getColorClasses = (color: string) => {
//     const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
//       blue: {
//         bg: "bg-blue-50",
//         text: "text-blue-600",
//         border: "border-blue-200",
//         hover: "hover:bg-blue-100",
//       },
//       purple: {
//         bg: "bg-purple-50",
//         text: "text-purple-600",
//         border: "border-purple-200",
//         hover: "hover:bg-purple-100",
//       },
//       green: {
//         bg: "bg-green-50",
//         text: "text-green-600",
//         border: "border-green-200",
//         hover: "hover:bg-green-100",
//       },
//       orange: {
//         bg: "bg-orange-50",
//         text: "text-orange-600",
//         border: "border-orange-200",
//         hover: "hover:bg-orange-100",
//       },
//       yellow: {
//         bg: "bg-yellow-50",
//         text: "text-yellow-600",
//         border: "border-yellow-200",
//         hover: "hover:bg-yellow-100",
//       },
//       red: {
//         bg: "bg-red-50",
//         text: "text-red-600",
//         border: "border-red-200",
//         hover: "hover:bg-red-100",
//       },
//     };
//     return colors[color] || colors.blue;
//   };

//   const renderReport = () => {
//     switch (selectedReport) {
//       case "daily-summary":
//         return <DailySummaryReport />;
//       case "agent-summary":
//         return <AgentSummaryReport />;
//       case "transaction-register":
//         return <TransactionRegisterReport />;
//       case "commission-report":
//         return <CommissionReport />;
//       default:
//         return null;
//     }
//   };

//   if (selectedReport) {
//     return (
//       <Layout>
//         <div className="p-4 md:p-6">
//           <button
//             onClick={() => setSelectedReport(null)}
//             className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium"
//           >
//             ← Back to Reports Menu
//           </button>
//           {renderReport()}
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="p-4 md:p-6">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
//           <p className="text-gray-600 mt-2 text-lg">
//             Generate comprehensive reports for your business insights
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {reportCards.map((card) => {
//             const colors = getColorClasses(card.color);
//             const Icon = card.icon;

//             return (
//               <button
//                 key={card.id}
//                 onClick={() => setSelectedReport(card.id)}
//                 className={`text-left p-6 rounded-xl border-2 ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-200 transform hover:scale-105 hover:shadow-xl`}
//               >
//                 <div className={`w-14 h-14 rounded-xl ${colors.bg} border-2 ${colors.border} flex items-center justify-center mb-4`}>
//                   <Icon className={`h-7 w-7 ${colors.text}`} />
//                 </div>
//                 <h3 className="text-lg font-bold text-gray-900 mb-2">
//                   {card.title}
//                 </h3>
//                 <p className="text-sm text-gray-600">{card.description}</p>
//                 <div className="mt-4 flex items-center text-sm font-medium">
//                   <span className={colors.text}>Generate Report →</span>
//                 </div>
//               </button>
//             );
//           })}
//         </div>

//         {/* Quick Tips Section */}
//         <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
//             <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
//               <DocumentTextIcon className="h-6 w-6" />
//               Report Features
//             </h2>
//             <ul className="space-y-2 text-sm text-blue-800">
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-600 mt-1">✓</span>
//                 <span>Export reports to PDF or Excel format</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-600 mt-1">✓</span>
//                 <span>Filter by date range, agent, or transaction type</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-600 mt-1">✓</span>
//                 <span>Real-time data generated from your database</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-600 mt-1">✓</span>
//                 <span>Print-friendly layouts for physical records</span>
//               </li>
//             </ul>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6">
//             <h2 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
//               <ChartBarIcon className="h-6 w-6" />
//               Best Practices
//             </h2>
//             <ul className="space-y-2 text-sm text-purple-800">
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-600 mt-1">→</span>
//                 <span>Generate daily reports for accurate record keeping</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-600 mt-1">→</span>
//                 <span>Review agent summaries weekly to track performance</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-600 mt-1">→</span>
//                 <span>Use commission reports for payroll processing</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-purple-600 mt-1">→</span>
//                 <span>Maintain backups of important reports</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Stats Overview */}
//         <div className="mt-10 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Available Report Types
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center p-4 bg-gray-50 rounded-lg">
//               <p className="text-3xl font-bold text-blue-600">4</p>
//               <p className="text-sm text-gray-600 mt-1">Report Types</p>
//             </div>
//             <div className="text-center p-4 bg-gray-50 rounded-lg">
//               <p className="text-3xl font-bold text-green-600">∞</p>
//               <p className="text-sm text-gray-600 mt-1">Date Range</p>
//             </div>
//             <div className="text-center p-4 bg-gray-50 rounded-lg">
//               <p className="text-3xl font-bold text-purple-600">2</p>
//               <p className="text-sm text-gray-600 mt-1">Export Formats</p>
//             </div>
//             <div className="text-center p-4 bg-gray-50 rounded-lg">
//               <p className="text-3xl font-bold text-orange-600">⚡</p>
//               <p className="text-sm text-gray-600 mt-1">Real-time Data</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// pages/reports/index.tsx
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  BanknotesIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

type ReportType = 
  | "daily-summary"
  | "agent-summary"
  | "transaction-register"
  | "account-ledger"
  | "commission-report"
  | "payment-receipt-analysis";

interface ReportCard {
  id: ReportType;
  title: string;
  description: string;
  icon: any;
  color: string;
}

const reportCards: ReportCard[] = [
  {
    id: "daily-summary",
    title: "Daily Summary Report",
    description: "View daily opening, closing, receipts, payments, and commissions",
    icon: CalendarIcon,
    color: "blue",
  },
  {
    id: "agent-summary",
    title: "Agent Summary Report",
    description: "Detailed agent-wise transaction summary with balances",
    icon: UserGroupIcon,
    color: "purple",
  },
  {
    id: "transaction-register",
    title: "Transaction Register",
    description: "Complete list of all transactions with filters",
    icon: DocumentTextIcon,
    color: "green",
  },
  {
    id: "account-ledger",
    title: "Account Ledger Report",
    description: "Account-wise detailed ledger with running balance",
    icon: ChartBarIcon,
    color: "orange",
  },
  {
    id: "commission-report",
    title: "Commission Analysis",
    description: "Agent-wise commission earned over a period",
    icon: BanknotesIcon,
    color: "yellow",
  },
  {
    id: "payment-receipt-analysis",
    title: "Payment & Receipt Analysis",
    description: "Comparative analysis of payments and receipts",
    icon: ArrowDownTrayIcon,
    color: "red",
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        hover: "hover:bg-blue-100",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        hover: "hover:bg-purple-100",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        hover: "hover:bg-green-100",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        hover: "hover:bg-orange-100",
      },
      yellow: {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        border: "border-yellow-200",
        hover: "hover:bg-yellow-100",
      },
      red: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        hover: "hover:bg-red-100",
      },
    };
    return colors[color] || colors.blue;
  };

  if (selectedReport) {
    return (
      <Layout>
        <div className="p-4 md:p-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Reports
          </button>
          {/* Report components will be rendered here */}
          <div className="text-center py-12 text-gray-600">
            Report component for {selectedReport} will be rendered here
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">
            Generate comprehensive reports for your business insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((card) => {
            const colors = getColorClasses(card.color);
            const Icon = card.icon;

            return (
              <button
                key={card.id}
                onClick={() => setSelectedReport(card.id)}
                className={`text-left p-6 rounded-lg border ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
              >
                <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Quick Tips</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• All reports can be exported to PDF or Excel format</li>
            <li>• Use date filters to generate reports for specific periods</li>
            <li>• Agent and account filters help narrow down your data</li>
            <li>• Reports are generated in real-time from your database</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}