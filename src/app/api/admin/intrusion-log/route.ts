import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = body.path || '/admin';

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      body._forwardedIp ||
      '';

    const userAgent = request.headers.get('user-agent') || body._userAgent || '';

    let location = null;
    if (ip && ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,org,as,lat,lon,query`);
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
          location = {
            country: geoData.country,
            region: geoData.regionName,
            city: geoData.city,
            isp: geoData.isp,
            org: geoData.org,
            as: geoData.as,
            lat: geoData.lat,
            lon: geoData.lon,
          };
        }
      } catch {
        // geolocation failed silently
      }
    }

    const { error } = await supabase.from('admin_intrusion_log').insert({
      ip,
      user_agent: userAgent,
      path,
      location,
    });

    if (error) {
      console.error('Error inserting intrusion log:', error);
      return NextResponse.json({ error: 'Failed to log intrusion' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Intrusion log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
