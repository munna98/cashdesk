import Layout from "@/components/layout/Layout"
import RecipientForm from "@/components/recipients/RecipientForm"

export default function RecipientFormPage() {
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Add / Edit Recipient</h1>
        <RecipientForm />
      </div>
    </Layout>
  )
}