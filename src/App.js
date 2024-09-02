import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const BACKEND_HOST = 'http://localhost:3000';
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      console.log({BACKEND_HOST})
      const response = await axios.post(`${BACKEND_HOST}/image-processor/passport`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (error) {
      console.error("There was an error processing the file!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Passport OCR</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                Upload Passport Image
              </label>
              <input
                  type="file"
                  id="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleFileChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
              >
                {loading ? "Processing..." : "Upload & Extract"}
              </button>
            </div>
          </form>
          {result && (
              <div className="mt-6">
                <h2 className="text-lg font-bold mb-2">Extracted Information:</h2>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  <li><strong>First Name:</strong> {result.firstName}</li>
                  <li><strong>Last Name:</strong> {result.lastName}</li>
                  <li><strong>Date of Birth:</strong> {result.dateOfBirth}</li>
                  <li><strong>Expiry Date:</strong> {result.expiryDate}</li>
                </ul>
              </div>
          )}
        </div>
      </div>
  );
}

export default App;
