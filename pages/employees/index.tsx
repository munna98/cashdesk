import Layout from "@/components/layout/Layout"
import EmployeeList from "@/components/employees/EmployeeList"

export default function EmployeesPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Employees</h1>
          <a href="/employees/form" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">+ Add Employee</a>
        </div>
        <EmployeeList />
      </div>
    </Layout>
  )
}
