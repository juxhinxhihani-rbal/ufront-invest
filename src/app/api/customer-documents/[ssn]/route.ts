import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '@/utils/secrets';

export async function GET(
  request: NextRequest,
  { params }: { params: { ssn: string } }
) {
  try {
    const { ssn } = params;
    const { searchParams } = new URL(request.url);
    const fundId = searchParams.get('fundId');
    const orderId = searchParams.get('orderId');

    // Validate required parameters
    if (!ssn || !fundId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required parameters: ssn, fundId, and orderId are required' },
        { status: 400 }
      );
    }

    console.log(`Fetching documents for SSN: ${ssn}, Fund ID: ${fundId}, Order ID: ${orderId}`);

    // Get configuration
    const config = await getConfig();
    const baseUrl = config.DocumentApiBaseUrl || config.InvestBaseUrl;

    if (!baseUrl) {
      console.error('Document API base URL not found in configuration');
      return NextResponse.json(
        { error: 'Document API configuration not found' },
        { status: 500 }
      );
    }

    // Make the call to the external API
    const externalApiUrl = `utility/api/customer/documents/${ssn}?fundId=${fundId}&orderId=${orderId}`;
    const fullUrl = `${baseUrl}${externalApiUrl}`;

    console.log(`Making request to: ${fullUrl}`);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.API_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`External API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch documents: ${response.statusText}` },
        { status: response.status }
      );
    }

    // The API returns JSON with base64-encoded documents
    const jsonData = await response.json();
    
    // Check if it's an error response
    if (jsonData.error) {
      return NextResponse.json(
        { error: jsonData.error },
        { status: 400 }
      );
    }
    
    // Return the JSON response containing base64 document(s)
    return NextResponse.json(jsonData);

  } catch (error) {
    console.error('Error fetching customer documents:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching documents' },
      { status: 500 }
    );
  }
}
