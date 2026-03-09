'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('themes');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900">My Store</h1>
        </div>

        <nav className="px-2 py-4">
          {/* Sales channels */}
          <div className="mb-6">
            <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
              Sales channels
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Online Store */}
            <div className="mb-2">
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Online Store
              </button>

              {/* Themes submenu */}
              <div className="ml-8 mt-1">
                <button
                  onClick={() => setActiveSection('themes')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeSection === 'themes'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Themes
                </button>
                <button
                  onClick={() => setActiveSection('pages')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeSection === 'pages'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Pages
                </button>
                <button
                  onClick={() => setActiveSection('preferences')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeSection === 'preferences'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Preferences
                </button>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === 'themes' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Themes</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Horizon Theme</h3>
                    <p className="text-sm text-gray-500">Your current theme - Live Preview</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="/editor"
                      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
                    >
                      Customize
                    </a>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-md overflow-hidden" style={{ height: '600px' }}>
                  <iframe
                    src="/preview"
                    className="w-full h-full"
                    title="Theme Preview"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'pages' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pages</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-600">Manage your store pages here.</p>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-600">Configure your store preferences.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
