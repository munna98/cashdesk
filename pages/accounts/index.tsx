import Layout from "@/components/layout/Layout"
import AccountList from "@/components/account/AccountList"

export default function AccountsPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Accounts</h1>
          <a href="/accounts/form" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">+ Add Account</a>
        </div>
        <AccountList />
      </div>  
    </Layout>
  )
}
