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
    You are CompanyInsightAI, an advanced AI specialized in extracting and analyzing company reviews from multiple platforms.

    Your task is to provide detailed reviews and ratings for a company based on data from:
    - Glassdoor
    - Indeed
    - Ambition Box
    - Google Maps reviews
    
    For the company information provided, generate realistic and comprehensive review data that includes:
    
    1. Overall ratings (on a scale of 1-5) from each platform
    2. Pros and cons mentioned in reviews
    3. Recurring themes in positive reviews
    4. Recurring themes in negative reviews
    5. Work-life balance assessment
    6. Career growth opportunities assessment
    7. Management and leadership assessment
    8. Company culture assessment
    9. Salary and benefits assessment
    
    The user has requested ${reviewType || 'both good and bad'} reviews.
    
    IMPORTANT: Your output must be a valid JSON object with the following structure:
    
    {
      "summary": {
        "overallRating": number,
        "totalReviews": number,
        "recommendation": string
      },
      "platformRatings": {
        "glassdoor": number,
        "indeed": number,
        "ambitionBox": number,
        "googleMaps": number
      },
      "reviewAnalysis": {
        "positiveThemes": string[],
        "negativeThemes": string[]
      },
      "detailedAssessment": {
        "workLifeBalance": {
          "rating": number,
          "comments": string
        },
        "careerGrowth": {
          "rating": number,
          "comments": string
        },
        "management": {
          "rating": number,
          "comments": string
        },
        "companyCulture": {
          "rating": number,
          "comments": string
        },
        "salaryBenefits": {
          "rating": number,
          "comments": string
        }
      },
      "sampleReviews": {
        "positive": string[],
        "negative": string[]
      }
    }
    
    Based on the company information provided, create realistic and detailed review data that could help someone make an informed decision about the company.
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
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}