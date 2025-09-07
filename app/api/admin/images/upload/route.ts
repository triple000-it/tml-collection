import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const djId = formData.get('djId') as string;
    const imageType = formData.get('imageType') as 'front' | 'back' | 'icon';
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${djId || 'asset'}_${imageType}_${Date.now()}.${fileExt}`;
    const filePath = `dj-images/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('dj-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('dj-assets')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update DJ record with image URL
    if (djId && imageType) {
      const updateField = imageType === 'front' ? 'image_url' : 
                         imageType === 'back' ? 'back_image_url' : 'icon_url';
      
      const { error: updateError } = await supabaseAdmin
        .from('djs')
        .update({ [updateField]: publicUrl })
        .eq('id', djId);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: 'Failed to update DJ record' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      fileName: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    const djId = searchParams.get('djId');
    const imageType = searchParams.get('imageType') as 'front' | 'back' | 'icon';

    if (!filePath) {
      return NextResponse.json({ error: 'No file path provided' }, { status: 400 });
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabaseAdmin.storage
      .from('dj-assets')
      .remove([filePath]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }

    // Update DJ record to remove image URL
    if (djId && imageType) {
      const updateField = imageType === 'front' ? 'image_url' : 
                         imageType === 'back' ? 'back_image_url' : 'icon_url';
      
      const { error: updateError } = await supabaseAdmin
        .from('djs')
        .update({ [updateField]: null })
        .eq('id', djId);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: 'Failed to update DJ record' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
