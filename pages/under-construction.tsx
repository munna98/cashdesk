// UnderConstruction.tsx
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useRouter } from "next/router"

export default function UnderConstruction() {
  const router = useRouter()
  const pageName = router.pathname.split('/').pop() || 'This page'
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, ' ')
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4">
        <div className="max-w-md w-full text-center">
          {/* Construction Icon */}
          <div className="mx-auto w-24 h-24 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-500">
              <path d="M92.5,87.5h-85v-10h85V87.5z" fill="currentColor" />
              <path d="M30,77.5l5-50h30l5,50H30z" fill="currentColor" fillOpacity="0.6" />
              <path d="M50,27.5v-15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              <path d="M35,12.5h30" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              <path d="M40,37.5h20" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
              <path d="M40,52.5h20" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
              <path d="M40,67.5h20" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Under Construction
          </h1>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This page is currently under development and will be available soon.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              We're working hard to bring you new features in our Cash Desk App.
            </p>
            
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Please check back later for updates
                </p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link href="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Return to Dashboard
              </Link>
              
              <button onClick={() => router.back()} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Go Back
              </button>
            </div>
          </div>
          
          {/* Optional: Animation */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-end space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 bg-gray-300 rounded-t-lg"
                  style={{
                    height: `${20 + i * 10}px`,
                    animation: `pulse 1s ease-in-out ${i * 0.2}s infinite alternate`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          <style jsx>{`
            @keyframes pulse {
              from { transform: scaleY(1); }
              to { transform: scaleY(1.5); }
            }
          `}</style>
        </div>
      </div>
    </Layout>
  )
}