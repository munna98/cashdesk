import Layout from "@/components/layout/Layout"
import RecipientList from "@/components/recipients/RecipientList"

export default function RecipientsPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Recipients</h1>
          <a href="/recipients/form" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
            + Add Recipient
          </a>
        </div>
        <RecipientList />
      </div>
    </Layout>
  )
}
