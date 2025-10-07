import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import {getConfig} from "@/utils/secrets";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const config = await getConfig();
    const baseUrl = config.InvestBaseUrl;
    
    if (!baseUrl) {
      throw new Error('InvestBaseUrl is not configured in env.json');
    }
    
    const response = await fetch(`${baseUrl}utility/api/risk`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // This endpoint might not return data, just success status
    const responseData = response.headers.get('content-length') !== '0' 
      ? await response.json() 
      : { success: true };
      
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Failed to submit risk result:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit risk result';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
