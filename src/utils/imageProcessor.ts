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
 * Calls Remove.bg API to remove background.
 */
export async function removeBackground(imageUrl: string): Promise<string> {
  const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY;

  // If no key is configured, fallback to mock immediately (or warn)
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn("No VITE_REMOVE_BG_API_KEY found. Using mock mode.");
    return mockRemoveBackground(imageUrl);
  }

  try {
    const blob = dataURLtoBlob(imageUrl);
    const formData = new FormData();
    formData.append('image_file', blob);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.title || `API Error: ${response.status}`);
    }

    const resultBlob = await response.blob();
    return URL.createObjectURL(resultBlob);

  } catch (error) {
    console.error('Background removal failed:', error);
    
    // User interaction for fallback
    const shouldFallback = window.confirm(
      `AI 抠图失败: ${error instanceof Error ? error.message : '未知错误'}\n\n是否切换到模拟模式（仅显示原图）继续？`
    );

    if (shouldFallback) {
      return mockRemoveBackground(imageUrl);
    }
    
    throw error; // Re-throw if user cancels, so UI stays in error state or handles it
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
