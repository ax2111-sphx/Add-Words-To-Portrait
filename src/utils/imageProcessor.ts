/**
 * Helper to convert Data URL to Blob for API upload
 */
function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Simulates calling a background removal API (Fallback).
 */
async function mockRemoveBackground(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    console.log('Using Mock background removal...');
    setTimeout(() => {
      resolve(imageUrl); 
    }, 1500);
  });
}

/**
 * Calls Backend Proxy to remove background.
 */
export async function removeBackground(imageUrl: string): Promise<string> {
  // Frontend no longer needs to know about the API Key
  
  try {
    const blob = dataURLtoBlob(imageUrl);
    const formData = new FormData();
    formData.append('image_file', blob);
    formData.append('size', 'auto');

    // Call our local backend proxy
    const response = await fetch('/api/remove-bg', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Check if it's a server configuration error (missing key)
      if (response.status === 500 && errorData.error?.includes('API Key missing')) {
        throw new Error('Server configuration error: REMOVE_BG_API_KEY is missing on the server.');
      }
      throw new Error(errorData.error || errorData.errors?.[0]?.title || `Server Error: ${response.status}`);
    }

    const resultBlob = await response.blob();
    return URL.createObjectURL(resultBlob);

  } catch (error) {
    console.error('Background removal failed:', error);
    
    // User interaction for fallback
    const shouldFallback = window.confirm(
      `AI background removal failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nSwitch to mock mode (show original image only) to continue?`
    );

    if (shouldFallback) {
      return mockRemoveBackground(imageUrl);
    }
    
    throw error;
  }
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
