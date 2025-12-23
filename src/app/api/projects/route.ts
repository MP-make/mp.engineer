import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, link, github_link, technologies, status, is_full_page, content_structure, created_at } = body;

    const { data, error } = await supabase
      .from('portfolio_project')
      .insert([{
        title,
        description,
        link: link || null,
        github_link: github_link || null,
        technologies,
        status,
        is_full_page,
        content_structure,
        created_at: created_at || new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, link, github_link, technologies, status, is_full_page, content_structure } = body;

    const { data, error } = await supabase
      .from('portfolio_project')
      .update({
        title,
        description,
        link: link || null,
        github_link: github_link || null,
        technologies,
        status,
        is_full_page,
        content_structure
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('portfolio_project')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}