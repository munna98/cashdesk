import Layout from "@/components/layout/Layout"
import EmployeeForm from "@/components/employees/EmployeeForm"

export default function EmployeeFormPage() {
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Add / Edit Employee</h1>
        <EmployeeForm />
      </div>
    </Layout>
  )
}