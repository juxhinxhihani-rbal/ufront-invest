// Utility function for safe JSON parsing from fetch responses
export interface SafeJsonParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function safeJsonParse<T>(response: Response): Promise<SafeJsonParseResult<T>> {
  try {
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        error: `Invalid content type: ${contentType}. Expected application/json`
      };
    }

    // Check if response has content
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      return {
        success: false,
        error: 'Empty response body'
      };
    }

    // Get response text first
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      return {
        success: false,
        error: 'Empty response body'
      };
    }

    // Parse JSON
    const data = JSON.parse(responseText) as T;
    return {
      success: true,
      data
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown JSON parsing error'
    };
  }
}

// Utility function for safe error response parsing
export async function safeErrorParse(response: Response): Promise<{ error?: string }> {
  try {
    const result = await safeJsonParse<{ error?: string }>(response);
    return result.success ? (result.data || {}) : {};
  } catch {
    return {};
  }
}
