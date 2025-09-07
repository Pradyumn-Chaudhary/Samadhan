import axios from 'axios';
import { Platform } from 'react-native';
import { BACKEND_URL } from '@env';

/**
 * Uploads media (photo/audio) to backend which stores in GCS.
 *
 * @param params.mediaUri - Local file URI (e.g., "file:///.../photo.jpg").
 * @param params.mediaMimeType - MIME type (e.g., "image/jpeg", "audio/mpeg").
 * @param params.uploadType - Either "photo" or "audio" (tells backend folder).
 * @returns Public URL string of uploaded media.
 */
export const uploadMedia = async ({
  mediaUri,
  mediaMimeType,
  uploadType,
}: {
  mediaUri: string;
  mediaMimeType: string;
  uploadType: 'photo' | 'audio';
}): Promise<string> => {
  const uploadUrl = `${BACKEND_URL}/upload/media`;
  const formData = new FormData();

  // 🔹 Fix iOS special `ph://` scheme → usable assets-library://
  let fixedUri = mediaUri;
  if (Platform.OS === 'ios' && mediaUri.startsWith('ph://')) {
    fixedUri = mediaUri.replace('ph://', 'assets-library://');
  }

  // 🔹 Extract filename, fallback if missing
  const filename =
    mediaUri.split('/').pop() || `${Date.now()}.${uploadType}`;

  // 🔹 Attach file (must match backend field name 'mediaFile')
  formData.append('mediaFile', {
    uri: fixedUri,
    name: filename,
    type: mediaMimeType,
  } as any);

  // 🔹 Attach mediaType (must match backend req.body.mediaType)
  formData.append('mediaType', uploadType);

  try {
    console.log(`Uploading ${uploadType} → ${uploadUrl}`);

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      timeout: 20000, // 20s timeout for big uploads
    });

    // ✅ Return public URL from backend
    return response.data.url as string;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Upload failed:',
        error.message,
        error.response?.data || 'No response body'
      );
    } else {
      console.error('Unexpected upload error:', error);
    }
    throw new Error('Failed to upload the file. Please try again.');
  }
};
