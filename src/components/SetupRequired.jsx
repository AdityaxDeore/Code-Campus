import React from 'react';

const SetupRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Required</h1>
          <p className="text-gray-600">Firebase configuration is missing</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">1</span>
            Copy the environment template
          </h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>cp .env.example .env</code>
          </pre>

          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">2</span>
            Add your Firebase credentials to <code className="bg-gray-200 px-2 py-1 rounded text-sm">.env</code>
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Required variables:</p>
            <ul className="text-sm text-gray-700 space-y-1 font-mono">
              <li>• VITE_FIREBASE_API_KEY</li>
              <li>• VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>• VITE_FIREBASE_PROJECT_ID</li>
              <li>• VITE_FIREBASE_APP_ID</li>
            </ul>
          </div>

          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">3</span>
            Restart the development server
          </h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            <code>npm start</code>
          </pre>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Need Firebase credentials?</strong> Create a new project at{' '}
            <a 
              href="https://console.firebase.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              Firebase Console
            </a>
            {' '}and copy the web app config.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupRequired;
