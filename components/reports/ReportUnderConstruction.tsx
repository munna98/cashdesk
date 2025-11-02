// components/reports/ReportUnderConstruction.tsx
import { 
  WrenchScrewdriverIcon,
  ClockIcon,
  DocumentTextIcon,
  BellAlertIcon
} from "@heroicons/react/24/outline";

interface ReportUnderConstructionProps {
  reportName: string;
  reportDescription?: string;
  expectedFeatures?: string[];
  estimatedCompletion?: string;
}

export default function ReportUnderConstruction({
  reportName,
  reportDescription = "This report is currently under development",
  expectedFeatures = [],
  estimatedCompletion = "Coming Soon"
}: ReportUnderConstructionProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
              <WrenchScrewdriverIcon className="h-8 w-8 text-yellow-900" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {reportName}
            </h2>
            <p className="text-gray-700 text-lg">
              {reportDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-white rounded-lg shadow-md border-l-4 border-yellow-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClockIcon className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Development Status
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Status:</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Under Construction
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Estimated Completion:</span>
            <span className="font-semibold text-gray-900">{estimatedCompletion}</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full animate-pulse" style={{ width: '45%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">Progress: 45%</p>
          </div>
        </div>
      </div>

      {/* Expected Features */}
      {expectedFeatures.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Planned Features
            </h3>
          </div>
          <ul className="space-y-3">
            {expectedFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  {index + 1}
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternative Reports */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <BellAlertIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Available Reports
          </h3>
        </div>
        <p className="text-gray-700 mb-4">
          While we're working on this report, you can use these available reports:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left flex items-center gap-2"
          >
            <span>← Back to Reports Menu</span>
          </button>
          <a
            href="/dashboard"
            className="px-4 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
          >
            Go to Dashboard
          </a>
        </div>
      </div>

      {/* Illustration */}
      <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200">
        <div className="max-w-md mx-auto text-center">
          {/* Construction Illustration */}
          <svg
            className="w-48 h-48 mx-auto mb-6"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Construction Cone */}
            <path
              d="M100 40L120 100H80L100 40Z"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="2"
            />
            <path
              d="M100 60L115 100H85L100 60Z"
              fill="#FCD34D"
            />
            <rect
              x="75"
              y="100"
              width="50"
              height="10"
              fill="#1F2937"
            />
            
            {/* Tools */}
            <g transform="translate(140, 80)">
              <rect
                x="0"
                y="0"
                width="8"
                height="40"
                fill="#6B7280"
                transform="rotate(45 4 20)"
              />
              <circle cx="4" cy="4" r="6" fill="#EF4444" />
            </g>
            
            {/* Base */}
            <rect
              x="60"
              y="110"
              width="80"
              height="8"
              rx="4"
              fill="#4B5563"
            />
          </svg>

          <h4 className="text-xl font-bold text-gray-900 mb-2">
            We're Building Something Great!
          </h4>
          <p className="text-gray-600">
            Our team is working hard to bring you powerful reporting capabilities.
            Check back soon for updates!
          </p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Have Suggestions?
        </h3>
        <p className="text-gray-700 mb-4">
          We'd love to hear your ideas about what features you'd like to see in this report!
        </p>
        <button
          onClick={() => alert("Feedback form would open here")}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          Share Your Feedback
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Development Timeline
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Phase 1: Planning</p>
              <p className="text-sm text-gray-600">Requirements gathered and design approved</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-sm">⟳</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Phase 2: Development</p>
              <p className="text-sm text-gray-600">Currently in progress...</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">3</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Phase 3: Testing</p>
              <p className="text-sm text-gray-600">Quality assurance and bug fixes</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">4</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Phase 4: Launch</p>
              <p className="text-sm text-gray-600">Report goes live for all users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}