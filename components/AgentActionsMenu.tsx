import Link from "next/link";

type Props = {
  agentId: string;
  onDelete: (id: string) => void;
};

export default function AgentActionsMenu({ agentId, onDelete }: Props) {
  return (
    <div className="absolute right-6 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200 transition-all duration-150 ease-in-out">
      <div className="py-1">
        <Link
          href={`/agents/form?id=${agentId}`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(agentId)}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
