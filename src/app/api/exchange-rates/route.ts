import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getConfig } from '@/utils/secrets';


export async function GET() {
  try {
    const config = await getConfig(); // Use secrets service instead of loadEnvConfig
    const baseUrl = config.FxBaseUrl;

    if (!baseUrl) {
      throw new Error('Configuration error');
    }
      const fullUrl = `${baseUrl}utility/api/Fx/DailyBulletin`;    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30000),
    });
    // Get the response text first to see what we're actually getting
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error('External service error');
    }

    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response from service');
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Exchange rates API error:', error);
    return NextResponse.json(
        { error: "Connection Error" },
        { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await getConfig();
    const baseUrl = config.FxBaseUrl;

    if (!baseUrl) {
      throw new Error('FxBaseUrl is not configured in secrets manager');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');

    // Send to external API
    const response = await fetch(`${baseUrl}utility/api/Fx/DailyBulletin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: base64String,
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error('External service error');
    }

    const responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ result: responseText });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to insert exchange rates';
    return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
    );
  }
}