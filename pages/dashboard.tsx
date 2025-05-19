import { useState, useEffect } from "react"
import axios from "axios"
import Layout from "@/components/layout/Layout"
import SummaryCards from "@/components/dashboard/SummaryCards"
import AgentCard from "@/components/dashboard/AgentCard"

interface Agent {
    _id: string
    name: string
    commPercent: number
    openingBalance: number
}

interface Receipt {
    _id: string
    agentId: string
    amount: number
    commission: number
    date: string
}

interface Payment {
    _id: string
    agentId: string
    amount: number
    date: string
}

const ThreeCirclesLoader = () => {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
};


export default function Dashboard() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)

    const today = new Date().toISOString().split('T')[0]

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch agents
                const agentsRes = await axios.get('/api/agents')
                setAgents(agentsRes.data)

                // Fetch receipts and payments for today
                const receiptsRes = await axios.get(`/api/transactions?type=receipt&date=${today}`)
                setReceipts(receiptsRes.data)

                const paymentsRes = await axios.get(`/api/transactions?type=payment&date=${today}`)
                setPayments(paymentsRes.data)

                setLoading(false)
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
                setLoading(false)
            }
        }

        fetchData()
    }, [today])

    const todayReceipts = receipts
    const todayPayments = payments

    const totalReceived = todayReceipts.reduce((sum, r) => sum + r.amount, 0)
    const totalCommission = todayReceipts.reduce((sum, r) => sum + (r.commission || 0), 0)
    const totalPaid = todayPayments.reduce((sum, p) => sum + p.amount, 0)

    const getAgentData = (agentId: string) => {
        const agentReceipts = todayReceipts.filter(r => r.agentId === agentId)
        const agentPayments = todayPayments.filter(p => p.agentId === agentId)
        const received = agentReceipts.reduce((sum, r) => sum + r.amount, 0)
        const commission = agentReceipts.reduce((sum, r) => sum + (r.commission || 0), 0)
        const paid = agentPayments.reduce((sum, p) => sum + p.amount, 0)

        return { received, commission, paid }
    }

    if (loading) {
        return (
            <Layout>
                <ThreeCirclesLoader />
            </Layout>
        )
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
                        const { received, commission, paid } = getAgentData(agent._id)
                        return (
                            <AgentCard
                                key={agent._id}
                                id={agent._id}
                                name={agent.name}
                                opening={agent.openingBalance || 0}
                                received={received}
                                paid={paid}
                                commission={commission}
                                commPercent={agent.commPercent}
                            />
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}

