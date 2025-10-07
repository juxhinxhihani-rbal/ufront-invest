import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import {getConfig} from "@/utils/secrets";
import { getServerSession } from "next-auth/next";
import { getAuthOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';

    // Get auth options dynamically and get user session
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const config = await getConfig();
    const baseUrl = config.InvestBaseUrl;
    
    if (!baseUrl) {
      throw new Error('InvestBaseUrl is not configured in env.json');
    }
    
    const languageRequest = language === "al" ? "sq-AL" : "en-US";
    
    // Try different possible endpoint paths
    const possiblePaths = [
      `risk/api/questions?language=${languageRequest}`    ];
    for (const path of possiblePaths) {
      try {
        const fullUrl = `${baseUrl}${path}`;

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`, // Include user's access token
          },
          signal: AbortSignal.timeout(10000), // Shorter timeout for testing
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (error) {
        continue;
      }
    }
    throw new Error('No working API endpoint found. Tried: ' + possiblePaths.join(', '));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch questions';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
