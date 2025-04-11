import Layout from "@/components/layout/Layout"
import PaymentForm from "@/components/transactions/PaymentForm"

export default function PaymentEntryPage() {
  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Enter Payment</h1>
        <PaymentForm />
      </div>
    </Layout>
  )
}
