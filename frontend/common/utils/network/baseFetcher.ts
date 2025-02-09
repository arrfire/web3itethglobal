
const baseHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetcher (
  key: string,
  options?: Readonly<{ arg: RequestInit }>,
) {
  try {
    const requestHeaders = {
      ...baseHeaders,
      ...options?.arg.headers,
    };

    const response = await fetch(key, {
      ...options?.arg,
      ...(options?.arg?.body ? { body: JSON.stringify(options.arg.body) } : {}),
      headers: requestHeaders,
    });
    const responseJson = await response.json();
    return {
      ...responseJson,
      code: response.status,
    };
  } catch (error) {
  }
}
