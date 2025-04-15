import Layout from "@/components/layout/Layout"
import EmployeeList from "@/components/employees/EmployeeList"

export default function EmployeesPage() {
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h1 className="text-xl md:text-2xl font-bold">Employees</h1>
          <a href="/employees/form" className="w-full sm:w-auto bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-center">
            + Add Employee
          </a>
        </div>
        <EmployeeList />
      </div>
    </Layout>
  )
}