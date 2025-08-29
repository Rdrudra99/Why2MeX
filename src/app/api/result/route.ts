import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, companyAddress, extraInfo, reviewType } = body;

    const userContent = `
    Company Name: ${companyName}
    Company Address: ${companyAddress}
    Extra Information: ${extraInfo || 'N/A'}
    Review Type Needed: ${reviewType || 'Both good and bad reviews'}
    `;

    const systemPrompt = `
    You are an AI assistant that fetches and returns real user reviews for companies from Glassdoor, Justdial, AmbitionBox, and Google Maps.

    ### Input:
    - Company Name
    - Company Address (optional)
    - Additional details (optional)

    ### Task:
    1. Search the internet for the company's reviews on Glassdoor, Justdial, AmbitionBox, and Google Maps.
    2. Collect real user feedback exactly as it appears, without rewriting or summarizing.
    3. Separate reviews into two categories:
       - good_reviews → positive feedback
       - bad_reviews → negative feedback
    4. Do not modify, paraphrase, or invent reviews. Only return actual user feedback from those platforms.
    5. Output only in **valid JSON** with the following format:

    ### Rules:
    - No summaries, no extra fields, no explanations.
    - If no reviews are found, return empty arrays.
    - Only return real user-generated feedback as available online.
    
    IMPORTANT: Your output must be a valid JSON object with the following structure:
    
    {
      "company_name": "<company name>",
      "good_reviews": [
        "...",
        "..."
      ],
      "bad_reviews": [
        "...",
        "..."
      ]
    }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      model: "deepseek-r1-distill-llama-70b",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    const messageContent = chatCompletion.choices[0].message.content;
    if (!messageContent) {
      throw new Error('No content returned from Groq API');
    }
    const content = JSON.parse(messageContent);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error processing request:', error);
    
    let errorMessage = 'Failed to process request';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-api-key-here') {
      errorMessage = 'API key not configured. Please add your GROQ API key to .env.local file.';
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      company_name: 'Error',
      good_reviews: [],
      bad_reviews: []
    }, { status: 500 });
  }
}