'use client';

import { useState } from 'react';
import NavBar from '@/components/DoctorNav/page';
import Markdown from 'react-markdown';

export default function AIinsight() {
  const [oxygenLevel, setOxygenLevel] = useState('');
  const [temperature, setTemperature] = useState('');
  const [heartBeat, setHeartBeat] = useState('');
  const [output, setOutput] = useState('');

  // Function to handle Generate Insight button
  const generateInsight = async () => {
    if (!oxygenLevel || !temperature || !heartBeat) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const prompt = `
        Patient's Vital Signs:
        - Oxygen Level: ${oxygenLevel}
        - Temperature: ${temperature}
        - Heart Beat: ${heartBeat}

        Please analyze these vitals and provide:
        - A diagnosis.
        - Suggested medications with dosage.
        - Any additional health advice or warnings.`;

      const response = await fetch('/api/generate/reportGenerator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput(data.error || 'Failed to generate insights.');
      }
    } catch (error) {
      console.error('Error:', error);
      setOutput('An error occurred while generating insights.');
    }
  };

  // Function to copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Output copied to clipboard');
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            AI-Driven Medical Insights
          </h1>

          {/* Input Fields */}
          <div className="space-y-6">
            <div>
              <label htmlFor="oxygenLevel" className="block text-lg font-medium text-gray-700">
                Oxygen Level (%)
              </label>
              <input
                type="number"
                id="oxygenLevel"
                value={oxygenLevel}
                onChange={(e) => setOxygenLevel(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 text-lg p-4 placeholder-gray-400"
                placeholder="e.g., 95"
              />
            </div>

            <div>
              <label htmlFor="temperature" className="block text-lg font-medium text-gray-700">
                Temperature (°C)
              </label>
              <input
                type="number"
                id="temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 text-lg p-4 placeholder-gray-400"
                placeholder="e.g., 37"
              />
            </div>

            <div>
              <label htmlFor="heartBeat" className="block text-lg font-medium text-gray-700">
                Heart Beat (BPM)
              </label>
              <input
                type="number"
                id="heartBeat"
                value={heartBeat}
                onChange={(e) => setHeartBeat(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 text-lg p-4 placeholder-gray-400"
                placeholder="e.g., 72"
              />
            </div>
          </div>

          {/* Generate Insight Button */}
          <div className="mt-8">
            <button
              onClick={generateInsight}
              className="w-full px-6 py-4 text-lg font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 transition"
            >
              Generate Insight
            </button>
          </div>

          {/* Output Section */}
          {output && (
            <div className="mt-10 p-6 bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Generated Insights</h2>
              <div className="text-lg text-gray-800">
                <Markdown className="prose">
                  {output}
                </Markdown>
              </div>

              {/* Copy to Clipboard Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring focus:ring-green-300 transition"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
