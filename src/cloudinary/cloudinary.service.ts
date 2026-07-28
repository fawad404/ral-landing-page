import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

export type CloudinaryFolder =
  | 'facilities'
  | 'partners'
  | 'social-boost'
  | 'deal-room';

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Upload a file buffer to Cloudinary.
   * Files are stored under: ral-connect/{folder}/
   */
  uploadBuffer(
    buffer: Buffer,
    folder: CloudinaryFolder,
    options?: { resourceType?: 'image' | 'video' | 'raw' | 'auto' },
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `ral-connect/${folder}`,
          resource_type: options?.resourceType ?? 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Delete a file from Cloudinary by its public_id.
   * The public_id is the path without the file extension, e.g.:
   *   ral-connect/facilities/abc123
   */
  async deleteByPublicId(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }

  /**
   * Extract the Cloudinary public_id from a secure_url.
   * e.g. https://res.cloudinary.com/dc9shyxcm/image/upload/v123/ral-connect/facilities/xyz.jpg
   *   → ral-connect/facilities/xyz
   */
  extractPublicId(url: string): string {
    // Remove everything up to and including /upload/vXXXX/
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : '';
  }
}
