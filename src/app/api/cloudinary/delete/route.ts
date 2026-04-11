import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export async function POST(req: NextRequest) {
  try {
    const { publicIds } = await req.json() as { publicIds: string[] };

    if (!publicIds?.length) {
      return NextResponse.json({ success: true });
    }

    await cloudinary.api.delete_resources(publicIds, { resource_type: 'image' });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Cloudinary delete]', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
