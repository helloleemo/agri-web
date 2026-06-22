function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

function resolveApiAssetUrl(fileUrl: string): string {
  if (!fileUrl) {
    return fileUrl
  }

  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')
  return `${baseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
}

export { getAccessToken, resolveApiAssetUrl }
