import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary';

// Give Cloudinary enough time to process large uploads (video especially).
export const maxDuration = 60;   // seconds
export const dynamic     = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export async function POST(req: NextRequest) {
  try {
    const form   = await req.formData();
    const file   = form.get('file')   as File   | null;
    const folder = form.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const resourceType = (form.get('resourceType') as string | null) || 'image';

    const uploadOptions: UploadApiOptions = {
      folder:        folder || 'skyhawk/properties',
      resource_type: resourceType as 'image' | 'video' | 'raw' | 'auto',
      transformation: resourceType === 'video'
        ? [{ width: 1280, crop: 'limit' }, { quality: 'auto:good' }]
        : [{ width: 1400, crop: 'limit' }, { quality: 'auto:good', fetch_format: 'webp' }],
    };

    const result = await cloudinary.uploader.upload(base64, uploadOptions);

    return NextResponse.json({
      url:          result.secure_url,
      publicId:     result.public_id,
      resourceType: result.resource_type,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Cloudinary upload]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
