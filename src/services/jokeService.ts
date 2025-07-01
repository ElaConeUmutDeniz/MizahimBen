import { JokeSource, AllowedSources } from '../types';
import { ALLOWED_SOURCES_URL } from '../constants';

/**
 * Converts various GitHub URL formats to a clean, raw content equivalent.
 * - Converts `github.com/.../blob/...` to `raw.githubusercontent.com/.../...`
 * - Removes `refs/heads` from the path.
 * - Strips all query parameters (e.g., `?token=...`).
 * @param url The URL to convert.
 * @returns The clean, raw content URL.
 */
function convertToRawGitHubUrl(url: string): string {
    let processedUrl = url;

    // Step 1: Handle standard github.com blob URLs
    // e.g., https://github.com/user/repo/blob/main/file.md -> https://raw.githubusercontent.com/user/repo/main/file.md
    if (processedUrl.includes('github.com') && processedUrl.includes('/blob/')) {
        processedUrl = processedUrl
            .replace('github.com', 'raw.githubusercontent.com')
            .replace('/blob/', '/');
    }

    // Step 2: Handle `refs/heads` which can appear in some GitHub URLs
    // e.g., .../repo/refs/heads/main/file.md -> .../repo/main/file.md
    if (processedUrl.includes('/refs/heads/')) {
        processedUrl = processedUrl.replace('/refs/heads/', '/');
    }

    // Step 3: Remove any query parameters (like ?token=...)
    const queryIndex = processedUrl.indexOf('?');
    if (queryIndex !== -1) {
        processedUrl = processedUrl.substring(0, queryIndex);
    }

    return processedUrl;
}

export async function getJokeSource(url: string): Promise<JokeSource> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.simdiki || !data.eski) {
        throw new Error("Invalid joke source format");
    }
    return data;
}

export async function getAllowedSources(): Promise<AllowedSources> {
    const response = await fetch(ALLOWED_SOURCES_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export async function getJokeContent(url: string): Promise<string> {
    const rawUrl = convertToRawGitHubUrl(url);
    const response = await fetch(rawUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} while fetching ${rawUrl}`);
    }
    return await response.text();
}
