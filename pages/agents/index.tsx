import Layout from "@/components/layout/Layout"
import AgentList from "@/components/agents/AgentList"

export default function AgentsPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Agents</h1>
          <a href="/agents/form" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">+ Add Agent</a>
        </div>
        <AgentList />
      </div>
    </Layout>
  )
}
