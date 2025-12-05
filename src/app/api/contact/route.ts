import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Usar el service role key para tener permisos completos
const supabase = createClient(supabaseUrl, supabaseKey);

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