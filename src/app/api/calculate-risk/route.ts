import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '@/utils/secrets';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const config = await getConfig();
    const baseUrl = config.InvestBaseUrl;
    
    if (!baseUrl) {
      throw new Error('InvestBaseUrl is not configured in env.json');
    }
    
    // Try different possible endpoint paths
    const possiblePaths = [
      'risk/api/calculator',
      'risk/api/calculate',
      'risk/calculator',
      'api/risk/calculator',
      'api/risk/calculate'
    ];
    

    for (const path of possiblePaths) {
      try {
        const fullUrl = `${baseUrl}${path}`;
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(30000),
        });

        
        // Get the response text first to see what we're actually getting
        const responseText = await response.text();
        if (response.ok) {
          try {
            const data = JSON.parse(responseText);
            return NextResponse.json(data);
          } catch (parseError) {// If it's not JSON, return the text as is
            return NextResponse.json({ result: responseText });
          }
        } else {
          console.log(`❌ HTTP error for ${path}: ${response.status} - ${responseText.substring(0, 100)}`);
        }
      } catch (error) {
        continue;
      }
    }
    
    // If we get here, none of the paths worked
    throw new Error('No working calculate-risk API endpoint found. Tried: ' + possiblePaths.join(', '));
  } catch (error) {
    console.error('Failed to calculate risk:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to calculate risk';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
