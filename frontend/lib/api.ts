const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

interface RequestOptions extends RequestInit { }

export async function fetchApi<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`
        }`;

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(options.headers ?? {}),
        },
        credentials: 'include', // required for Sanctum cookie auth later
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `API request failed with status ${response.status}`
        );
    }

    return response.json();
}