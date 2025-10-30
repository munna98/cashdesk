// components/employees/EmployeeList.tsx - Refactored with React Query
import { useRef, useState } from "react";
import {
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEmployees, useDeleteEmployee } from "@/hooks/queries/useAgents";

type Employee = {
  _id: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
  role: string;
};

export default function EmployeeList() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use React Query hooks
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await deleteEmployeeMutation.mutateAsync(id);
    } catch (error: any) {
      console.error("Failed to delete employee:", error);
      alert(error.response?.data?.error || "Failed to delete employee.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading employees...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading employees: {error?.message || 'Unknown error'}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No employees found.{" "}
        <Link href="/employees/form" className="text-blue-500 hover:underline">
          Please add an employee first
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((emp: Employee) => (
        <div
          key={emp._id}
          className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Card Header */}
          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
            <h3 className="font-medium text-gray-900 truncate">{emp.name}</h3>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => toggleMenu(emp._id)}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1 cursor-pointer"
                title="Employee actions"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>

              {activeMenu === emp._id && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <Link
                      href={`/employees/form?id=${emp._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      disabled={deleteEmployeeMutation.isPending}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {deleteEmployeeMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4">
            {/* Address */}
            <div className="flex items-start space-x-2 text-sm text-gray-500 mb-3">
              <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2" title={emp.address}>
                {emp.address}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <PhoneIcon className="h-4 w-4 flex-shrink-0" />
              <span>{emp.mobile}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={emp.email}>{emp.email}</span>
            </div>

            {/* Role */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 border-t pt-3">
              <BriefcaseIcon className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium text-gray-800">{emp.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}