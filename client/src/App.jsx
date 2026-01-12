import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Skill Loop! 🚀
        </h1>
        <p className="text-gray-600 mb-6">
          Exchange skills, learn together, grow together.
        </p>

        {/* Counter Demo - Shows useState in action */}
        <div className="bg-purple-100 rounded-lg p-6 mb-4">
          <p className="text-sm text-purple-600 font-semibold mb-2">
            useState Demo:
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
          >
            Clicked {count} times
          </button>
        </div>

        {/* Info Card with Tailwind Classes */}
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Pro Tip:</span> This card uses Tailwind classes like
            <code className="bg-blue-200 px-1 rounded text-xs mx-1">border-l-4</code> and
            <code className="bg-blue-200 px-1 rounded text-xs mx-1">bg-blue-50</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
