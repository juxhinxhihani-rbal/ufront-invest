import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '@/utils/secrets';
import { ensureInitialized } from '@/lib/init';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Ensure configuration is loaded before proceeding
        await ensureInitialized();
        
        const config = await getConfig();
        const baseUrl = config.InvestBaseUrl;
        
        if (!baseUrl) {
            console.error('InvestBaseUrl not found in configuration');
            return NextResponse.json(
                { error: 'Configuration error: API base URL not available' },
                { status: 500 }
            );
        }
        
        // Build API URL for fund types
        const apiUrl = `${baseUrl}investment/api/fundTypes`;
        
        console.log('Making API request to:', apiUrl);
        
        // Make the actual API call to your backend service
        const response = await fetch(apiUrl, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${config.API_TOKEN}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
        });
        console.log(response);
        console.log('API response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            return NextResponse.json(
                { error: `Failed to fetch funds: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/json')) {
            console.error('API returned non-JSON response:', {
                contentType,
                status: response.status,
                statusText: response.statusText
            });
            return NextResponse.json(
                { error: 'API returned invalid response format' },
                { status: 502 }
            );
        }

        // Get response text first to handle potential JSON parsing errors
        const responseText = await response.text();
        
        if (!responseText || responseText.trim() === '') {
            console.warn('API returned empty response body');
            return NextResponse.json([]);
        }

        let apiData;
        try {
            apiData = JSON.parse(responseText);
            console.log('Parsed funds response object:', apiData);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', {
                error: parseError,
                responseText: responseText.substring(0, 500)
            });
            return NextResponse.json(
                { error: 'Invalid JSON response from API' },
                { status: 502 }
            );
        }

        // Return raw backend array, let FundService handle mapping
        const nextResponse = NextResponse.json(apiData);
        nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        nextResponse.headers.set('Pragma', 'no-cache');
        nextResponse.headers.set('Expires', '0');
        return nextResponse;
    } catch (error) {
        console.error('Fund service API error:', error);
        return NextResponse.json(
            { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Ensure configuration is loaded before proceeding
        await ensureInitialized();
        const config = await getConfig();
        const baseUrl = config.InvestBaseUrl;
        if (!baseUrl) {
            console.error('InvestBaseUrl not found in configuration');
            return NextResponse.json(
                { error: 'Configuration error: API base URL not available' },
                { status: 500 }
            );
        }
        // Extract fund ID from query parameters
        const { searchParams } = new URL(request.url);
        const fundId = searchParams.get('id');
        if (!fundId) {
            return NextResponse.json(
                { error: 'Fund ID is required' },
                { status: 400 }
            );
        }
        // Read incoming request body and forward it unchanged to backend
        const reqBody = await request.json();

        // Build API URL for updating fund using path parameter (no literal {fundId})
        const apiUrl = `${baseUrl}investment/api/fundTypes/update/${fundId}`;
        console.log('Making API request to (forwarding raw body):', apiUrl);
        console.log('Forwarding request body (raw):', reqBody);

        // Make the actual API call to your backend service, forwarding the raw body
        const response = await fetch(apiUrl, {
            method: 'PUT',
            // ensure node-fetch does not use caches for forwarded requests
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${config.API_TOKEN}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            body: JSON.stringify(reqBody)
        });
        // ...error handling for response...
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('API returned non-JSON response:', {
                contentType,
                status: response.status,
                statusText: response.statusText
            });
            return NextResponse.json(
                { error: 'API returned invalid response format' },
                { status: 502 }
            );
        }
        // Get response text first to handle potential JSON parsing errors
        const responseText = await response.text();
        let apiObj;
        try {
            apiObj = responseText ? JSON.parse(responseText) : null;
            console.log('Parsed fund update response object:', apiObj);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', {
                error: parseError,
                responseText: responseText.substring(0, 500)
            });
            return NextResponse.json(
                { error: 'Invalid JSON response from API' },
                { status: 502 }
            );
        }
        // Return raw backend response object, let FundService handle mapping
        const nextResponse = NextResponse.json(apiObj);
        nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        nextResponse.headers.set('Pragma', 'no-cache');
        nextResponse.headers.set('Expires', '0');
        return nextResponse;
    } catch (error) {
        console.error('Fund service PUT API error:', error);
        return NextResponse.json(
            { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
