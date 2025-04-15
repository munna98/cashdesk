import Layout from "@/components/layout/Layout"
import AccountForm from "@/components/account/AccountForm"

export default function AccountFormPage() {
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Add / Edit Account</h1>
        <AccountForm />
      </div>
    </Layout>
  )
}