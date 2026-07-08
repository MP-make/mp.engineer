import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { auth } from '@/lib/auth';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('portfolio_cv')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116' || error.code === '42P01') {
      return NextResponse.json({ url: '/cv-marlon-pecho.pdf' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || { url: '/cv-marlon-pecho.pdf' });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const { url } = await request.json();
      if (!url) {
        return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
      }

      const { data, error: dbError } = await supabase
        .from('portfolio_cv')
        .insert([{ url }])
        .select()
        .single();

      if (dbError) {
        if (dbError.code === '42P01') {
          return NextResponse.json({ url, warning: 'DB table missing' });
        }
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const fileName = `cv-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName);

    const { data, error: dbError } = await supabase
      .from('portfolio_cv')
      .insert([{ url: publicUrl }])
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '42P01') {
        return NextResponse.json({ url: publicUrl, warning: 'DB table missing but file uploaded' });
      }
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error uploading CV' }, { status: 500 });
  }
}
