'use client';

import { useRouter } from 'next/navigation';
import NavBar from '@/components/DoctorNav/page';
import { useState } from "react";
import Markdown from 'react-markdown';

export default function AIinsight() {
  const [prescription, setPrescription] = useState(''); 
  const [output, setOutput] = useState('');
  const generateText = async () => {
    try {
      const prompt = `${prescription}. Give me an analysis of this report`; 
      const response = await fetch('/api/generate/reportGenerator', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({ body: prompt })
      });
      console.log(response);
      const data = await response.json();
      
      if(response.ok) {
        setOutput(data.output)
      } else {
        setOutput(data.error)
      }
    } catch(error) {
      console.error('Error:', error)
    }
  };

  return (
    <>
    <NavBar />
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-10">
      <div>
      <p className="text-center text-blue-700 text-3xl mb-6">Welcome Doctor , Please Enter Your Prescription to get the analysis</p>
      </div>
      <div className="z-10 max-w-4xl w-full p-10 bg-white rounded-lg shadow-lg flex flex-col items-center font-serif text-2xl text-center">
        {/* Input field for prescription */}
        <textarea 
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          placeholder="Enter prescription here..."
          className="mb-4 p-2 w-full h-32 border border-gray-300 rounded-lg"
        />
        
        <button 
          onClick={generateText} 
          className="bg-slate-200 p-2 rounded-md text-gray-800 hover:text-blue-600 hover:bg-cyan-100 transition duration-200 ease-in-out mb-4"
        >
          Generate Insights
        </button>

        {/* Display output */}
        <p className="text-gray-800">
          <Markdown >{output}</Markdown>

          {/* {output} */}
        </p>
      </div>
    </main>
    </>
  );
}

