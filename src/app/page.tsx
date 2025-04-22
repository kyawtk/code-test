"use client";
import { useHotelInfo } from "@/lib/useHotelInfo";
import { useState } from "react";
import { ZodError } from "zod";
import JsonViewer from "./components/JsonViewer";
export default function Home() {
  const [url, setUrl] = useState("");
  const { refetch, data, isLoading, error } = useHotelInfo({ url });
  return (
    <div className="container max-w-3xl mx-auto space-y-5 p-5">
      <h1 className="text-3xl font-bold text-center mb-5">
        Hotel Info Fetcher
      </h1>
      <div className="flex flex-col items-center space-y-3">
        <input
          type="url"
          placeholder="Enter Agoda hotel URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Get Hotel Info
        </button>
      </div>

      {error instanceof ZodError && (
        <ul className="mt-2 space-y-1">
          {error.errors.map((err, index) => (
            <li key={index}>
              {err.path.join(".")} - {err.message}
            </li>
          ))}
        </ul>
      )}
      {isLoading && <p>Loading</p>}

      <pre className="bg-gray-100 p-4 rounded-md mt-5 overflow-auto">
        <JsonViewer data={data} />
      </pre>
    </div>
  );
}
