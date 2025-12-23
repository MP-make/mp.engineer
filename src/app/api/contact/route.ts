import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { auth } from '@/lib/auth';

// Usar el service role key para tener permisos completos
const supabase = createClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validar datos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' }, 
        { status: 400 }
      );
    }

    // Insertar en la base de datos usando el service role key
    const { data, error } = await supabase
      .from('portfolio_contact')
      .insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Error al guardar el mensaje',
          details: error.message 
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Mensaje enviado correctamente',
      data 
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    .from('portfolio_contact')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}