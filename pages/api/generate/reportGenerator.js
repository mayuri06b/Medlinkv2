// // Import `GoogleGenerative` from the package we installed earlier.
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";
// export const runtime = 'edge';

// export default async function handler(req) {
//     if(req.method == 'POST'){
//     try {
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
//         const model = genAI.getGenerativeModel({ model: "gemini-pro" })
//         // const data = await req.json()
//         console.log(req.body);
        
//         // const prompt = (await req.json()).body
//         const prompt = (req.body).body
//         console.log(prompt);
        
//         const result = await model.generateContent(prompt)
//         console.log(result);
//         const response = await result.response;
//         const output = await response.text();
//         // console.log(result,response,output);
//         return NextResponse.json({ output: output })
//     } catch (error) {
//         console.error(error)
//     }
// }
// }
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
export const runtime = 'edge';

export default async function handler(req) {
    if (req.method === 'POST') {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            
            // Extracting the prompt from the request body
            const { body } = await req.json(); // Use `await req.json()` for Edge functions
            
            // Generating content based on the prompt
            const result = await model.generateContent(body);
            
            // Attempt to retrieve the response data from the result object
            const output = result.response; // Assuming `response` is in the result
            
            // Check if output is a stream and convert it to text if so
            const outputText = typeof output.text === 'function' 
                ? await output.text() 
                : output;

            return NextResponse.json({ output: outputText });
        } catch (error) {
            console.error('Error generating content:', error);
            return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
}
