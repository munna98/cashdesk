import Layout from "@/components/layout/Layout"
import AgentForm from "@/components/agents/AgentForm"

export default function AgentFormPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add / Edit Agent</h1>
        <AgentForm />
      </div>
    </Layout>
  )
}
