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
        
        // Extract pagination parameters from query string
        const { searchParams } = new URL(request.url);
        const searchKey = searchParams.get('SearchKey') || '';
        const pageNumber = searchParams.get('PageNumber') || '1';
        const pageSize = searchParams.get('PageSize') || '10';
        const status = searchParams.get('Status') || '';
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        
        // Build API URL with pagination parameters
        let apiUrl = `${baseUrl}utility/api/customers?SearchKey=${encodeURIComponent(searchKey)}&PageNumber=${pageNumber}&PageSize=${pageSize}`;
        
        // Add status filter if provided
        if (status && status !== 'all') {
            apiUrl += `&Status=${encodeURIComponent(status)}`;
        }
        
        apiUrl += `&_t=${timestamp}`;
        
        console.log('Making API request to:', apiUrl);
        
        // Make the actual API call to your backend service
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.API_TOKEN}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
        });
        
        console.log('API response status:', response.status, response.statusText);
        console.log('API response headers:', {
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length')
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            return NextResponse.json(
                { error: `Failed to fetch customer potentials: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        
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

        // Check if response body is empty
        if (contentLength === '0') {
            console.warn('API returned empty response');
            return NextResponse.json({ data: [], total: 0, message: 'No data available' });
        }

        // Get response text first to handle potential JSON parsing errors
        const responseText = await response.text();
        
        if (!responseText || responseText.trim() === '') {
            console.warn('API returned empty response body');
            return NextResponse.json({ data: [], total: 0, message: 'No data available' });
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', {
                error: parseError,
                responseText: responseText.substring(0, 500) // Log first 500 chars
            });
            return NextResponse.json(
                { error: 'Invalid JSON response from API' },
                { status: 502 }
            );
        }
        
        // Add no-cache headers to the response
        const nextResponse = NextResponse.json(data);
        nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        nextResponse.headers.set('Pragma', 'no-cache');
        nextResponse.headers.set('Expires', '0');
        
        return nextResponse;
    } catch (error) {
        console.error('Customer potentials API error:', error);
        return NextResponse.json(
            { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}