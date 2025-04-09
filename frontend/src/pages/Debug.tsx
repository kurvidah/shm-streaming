"use client";

import React, { useState } from "react";
import axios from "axios";

const Debug = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    try {
      setResponse(null);
      setError(null);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hello`, {
        headers: {
          Authorization: "your_secret_key_here",
        },
      });
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("API Test Error:", err);
      setError(err.message || "Failed to connect to the API");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Debug Page 2</h1>
      <button
        onClick={testApi}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Test API
      </button>

      <div className="mt-6">
        {response && (
          <div>
            <h2 className="text-xl font-semibold mb-2">API Response:</h2>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-auto">
              {response}
            </pre>
          </div>
        )}
        {error && (
          <div className="text-red-500 mt-4">
            <h2 className="text-xl font-semibold">Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debug;
