// pages/transactions/journal/index.tsx
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import JournalEntryForm from "@/components/transactions/JournalEntryForm";
import RecentJournalEntries from "./recent-journal";

export default function JournalEntryPage() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleJournalSaved = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <Layout>
      <div className="p-2 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Journal Entry
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          <div>
            <JournalEntryForm onJournalSaved={handleJournalSaved} />
          </div>

          <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Recent Journal Entries
            </h2>
            <RecentJournalEntries refreshTrigger={refreshCount} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

