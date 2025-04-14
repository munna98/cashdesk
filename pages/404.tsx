export default function Custom404() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <svg
            className="w-52 mx-auto mb-8"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="250" cy="250" r="250" fill="#FDE68A" />
            <path
              d="M180 310h140v30H180zM200 180c0-30 50-30 50 0v10c0 10-20 10-20 0V190c0-10-10-10-10 0v30c0 10-20 10-20 0v-40z"
              fill="#1E3A8A"
            />
            <circle cx="210" cy="230" r="10" fill="#1E3A8A" />
            <circle cx="290" cy="230" r="10" fill="#1E3A8A" />
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              fill="#1E3A8A"
              fontSize="80"
              fontWeight="bold"
              dy=".3em"
            >
              404
            </text>
          </svg>
  
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Page not found
          </h1>
          <p className="text-gray-600 mb-6">
            Looks like the cash you're tracking isn't here. Let's get you back on track!
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }
  