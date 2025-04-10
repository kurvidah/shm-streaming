"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Debug = () => {
  const [path, setPath] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availablePaths, setAvailablePaths] = useState<string[]>([]);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/`);
        setAvailablePaths(Object.keys(res.data));
      } catch (err: any) {
        console.error("Failed to fetch available paths:", err);
        setAvailablePaths([]);
      }
    };

    fetchPaths();
  }, []);

  const testApi = async () => {
    try {
      setResponse(null);
      setError(null);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/${path}`
      );
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      console.error("API Test Error:", err);
      setError(err.message || "Failed to connect to the API");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Debug Page</h1>
      <div className="mb-4">
        <label htmlFor="path" className="block text-lg font-medium mb-2">
          API Path:
        </label>
        <select
          id="path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full bg-gray-800"
        >
          <option value="" disabled>
            Select an API path
          </option>
          {availablePaths.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={testApi}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        disabled={!path}
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
