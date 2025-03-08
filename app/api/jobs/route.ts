import { NextResponse, NextRequest } from 'next/server';
import { URLSearchParams } from 'node:url';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    console.log(requestData)
    const { query, limit, id } = requestData;
    const params = new URLSearchParams();

    if (query != undefined && query?.trim() != "") {
      const keywords = query.trim().split(/\s+/);
      for (const keyword of keywords) {
        params.append('and', keyword);
      }
    }
    params.append('limit', limit?.toString() || '10');

    if (id && id.trim() != "") {
      params.append('_id', id);
    }

    const response = await fetch(`https://data.hirebase.org/v0/jobs?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `HTTP Error: ${response.status} - ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      ...data,
    });

  } catch (error: any) {
    console.error("Error in POST handler:", error); // Log the error for debugging

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "An unexpected error occurred.",  // Provide a user-friendly message
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Include stack trace in development
      },
      { status: 500 }
    );
  }
}
