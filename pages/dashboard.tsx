// Dashboard.tsx
import Layout from "@/components/layout/Layout"
import SummaryCards from "@/components/dashboard/SummaryCards"
import AgentCard from "@/components/dashboard/AgentCard"

import { agents } from "@/data/agents"
import { receipts } from "@/data/receipts"
import { payments } from "@/data/payments"

export default function Dashboard() {
  const today = "2025-04-11"
  
  const todayReceipts = receipts.filter(r => r.date === today)
  const todayPayments = payments.filter(p => p.date === today)
  
  const totalReceived = todayReceipts.reduce((sum, r) => sum + r.amount, 0)
  const totalCommission = todayReceipts.reduce((sum, r) => sum + r.commission, 0)
  const totalPaid = todayPayments.reduce((sum, p) => sum + p.amount, 0)
  
  const getAgentData = (agentId: string) => {
    const agentReceipts = todayReceipts.filter(r => r.agentId === agentId)
    const agentPayments = todayPayments.filter(p => p.agentId === agentId)
    const received = agentReceipts.reduce((sum, r) => sum + r.amount, 0)
    const commission = agentReceipts.reduce((sum, r) => sum + r.commission, 0)
    const paid = agentPayments.reduce((sum, p) => sum + p.amount, 0)
    
    return { received, commission, paid }
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <SummaryCards
          totalReceived={totalReceived}
          totalCommission={totalCommission}
          totalPaid={totalPaid}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => {
            const { received, commission, paid } = getAgentData(agent.id)
            return (
              <AgentCard
                key={agent.id}
                name={agent.name}
                opening={agent.openingBalance}
                received={received}
                paid={paid}
                commission={commission}
              />
            )
          })}
        </div>
      </div>
    </Layout>
  )
}