import React, { useState } from "react";
import { FaCog, FaBook, FaInfoCircle } from "react-icons/fa";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [generalSettings, setGeneralSettings] = useState({
    searchEngine: "Google",
    totalSearchResults: 10,
    internetSearch: true,
    exportHistory: false,
  });

  const [ragSettings, setRagSettings] = useState({
    embeddingModel: "nomic-embed-text",
    chunkSize: 1000,
    chunkOverlap: 200,
    retrievedDocs: 4,
  });

  const handleGeneralChange = (key, value) => {
    setGeneralSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleRagChange = (key, value) => {
    setRagSettings((prev) => ({ ...prev, [key]: value }));
  };

  const clearVectorSettings = () => {
    setRagSettings({ embeddingModel: "", chunkSize: 0, chunkOverlap: 0, retrievedDocs: 0 });
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-900 p-4 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <ul className="space-y-2">
          <li
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
              activeTab === "general" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("general")}
          >
            <FaCog />
            <span>General Settings</span>
          </li>
          <li
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
              activeTab === "rag" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("rag")}
          >
            <FaBook />
            <span>RAG Settings</span>
          </li>
          <li
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
              activeTab === "about" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("about")}
          >
            <FaInfoCircle />
            <span>About</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <>
            <h2 className="text-2xl font-bold mb-6">General Settings</h2>
            <div className="space-y-4">
              {/* Search Engine */}
              <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span>Search Engine</span>
                <select
                  className="bg-gray-700 text-white p-2 rounded"
                  value={generalSettings.searchEngine}
                  onChange={(e) => handleGeneralChange("searchEngine", e.target.value)}
                >
                  7
                  <option>searxng</option>
                  <option>DuckDuckGo</option>
                </select>
              </div>

              {/* Total Search Results */}
              <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span>Total Search Results</span>
                <input
                  type="number"
                  className="bg-gray-700 text-white p-2 rounded w-24"
                  value={generalSettings.totalSearchResults}
                  onChange={(e) => handleGeneralChange("totalSearchResults", e.target.value)}
                />
              </div>

              {/* Internet Search ON by default */}
              <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span>Internet Search ON by default</span>
                <input
                  type="checkbox"
                  checked={generalSettings.internetSearch}
                  onChange={() => handleGeneralChange("internetSearch", !generalSettings.internetSearch)}
                />
              </div>

              {/* Export Chat History, Knowledge Base, and Prompts */}
              <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span>Export Chat History, Knowledge Base, and Prompts</span>
                <input
                  type="checkbox"
                  checked={generalSettings.exportHistory}
                  onChange={() => handleGeneralChange("exportHistory", !generalSettings.exportHistory)}
                />
              </div>
            </div>
          </>
        )}

        {/* RAG Settings */}
        {activeTab === "rag" && (
          <>
            <h2 className="text-2xl font-bold mb-6">RAG Settings</h2>

            {/* Embedding Model */}
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
              <span>Embedding Model</span>
              <select
                className="bg-gray-700 text-white p-2 rounded"
                value={ragSettings.embeddingModel}
                onChange={(e) => handleRagChange("embeddingModel", e.target.value)}
              >
                <option>nomic-embed-text</option>
                <option>OpenAI Ada</option>
              </select>
            </div>

            {/* Chunk Size */}
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
              <span>Chunk Size</span>
              <input
                type="number"
                className="bg-gray-700 text-white p-2 rounded w-24"
                value={ragSettings.chunkSize}
                onChange={(e) => handleRagChange("chunkSize", e.target.value)}
              />
            </div>

            {/* Chunk Overlap */}
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
              <span>Chunk Overlap</span>
              <input
                type="number"
                className="bg-gray-700 text-white p-2 rounded w-24"
                value={ragSettings.chunkOverlap}
                onChange={(e) => handleRagChange("chunkOverlap", e.target.value)}
              />
            </div>

            {/* Number of Retrieved Documents */}
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
              <span>Number of Retrieved Documents</span>
              <input
                type="number"
                className="bg-gray-700 text-white p-2 rounded w-24"
                value={ragSettings.retrievedDocs}
                onChange={(e) => handleRagChange("retrievedDocs", e.target.value)}
              />
            </div>

            {/* Vector Clear Button */}
            <div className="text-center mt-4">
              <button
                className="bg-red-600 px-4 py-2 rounded"
                onClick={clearVectorSettings}
              >
                Clear Vector Settings
              </button>
            </div>
          </>
        )}

        {/* About Section */}
        {activeTab === "about" && (
          <>
            <h2 className="text-2xl font-bold mb-6">About</h2>
            <p>This settings panel allows users to configure application preferences, including advanced RAG settings and general options.</p>
            <p className="mt-2">Developed using React and TailwindCSS.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
