import { NextResponse } from 'next/server';
import { getConfig } from '@/utils/secrets';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const config = await getConfig();
    const BASE_URL = config.InvestBaseUrl;

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const fundId = searchParams.get('fundId');

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required query parameters: startDate and endDate' }, { status: 400 });
    }

    const params = new URLSearchParams({ startDate, endDate });
    if (fundId) {
      params.append('fundId', fundId);
    }

    const response = await fetch(`${BASE_URL}utility/api/fund/volumes?${params.toString()}`);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch fund performance data' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fund performance API error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  }
}