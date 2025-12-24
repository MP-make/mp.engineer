import React from 'react';

interface LaptopMockupProps {
  imageSrc: string;
}

export default function LaptopMockup({ imageSrc }: LaptopMockupProps) {
  return (
    <div className="flex justify-center items-center py-12">
      {/* Contenedor Principal */}
      <div className="relative mx-auto">
        
        {/* === TAPA DE LA LAPTOP (PANTALLA) === */}
        {/* Usamos ring-white/20 para que el borde se note en fondos oscuros */}
        <div className="relative bg-[#1a1a1a] rounded-t-2xl border-[10px] border-[#1a1a1a] w-[300px] sm:w-[500px] md:w-[720px] h-[190px] sm:h-[310px] md:h-[450px] shadow-2xl mx-auto flex flex-col items-center z-20 ring-1 ring-white/10">
          
          {/* Cámara Web */}
          <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#333] z-20 ring-1 ring-white/10"></div>
          
          {/* Pantalla Interna (Scrollable) */}
          <div className="w-full h-full bg-white rounded-lg overflow-hidden relative group border border-gray-800">
             
             {/* Contenedor con Scroll Nativo */}
            <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth bg-gray-100">
              <img 
                src={imageSrc || '/placeholder-desktop.jpg'} 
                alt="Desktop Screenshot" 
                className="w-full h-auto object-cover block min-h-full"
              />
            </div>
            
            {/* Indicador de Scroll (Overlay) */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none transition-opacity duration-500 group-hover:opacity-0">
                <div className="bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-medium animate-bounce border border-white/10 shadow-lg">
                    🖱️ Scroll para navegar
                </div>
            </div>
          </div>
        </div>

        {/* === BASE DE LA LAPTOP (TECLADO) === */}
        {/* Esta parte es clave para que parezca una laptop y no una tablet */}
        <div className="relative bg-[#202020] w-[340px] sm:w-[580px] md:w-[840px] h-[14px] sm:h-[20px] md:h-[24px] -mt-1 mx-auto rounded-b-xl rounded-t-sm shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] z-10 flex justify-center border-t border-white/10">
          
          {/* Muesca de apertura (The Lip) */}
          <div className="absolute top-0 w-[40px] sm:w-[70px] md:w-[100px] h-[3px] bg-[#151515] rounded-b-md border-t border-black/50"></div>
          
          {/* Patitas de goma (detalles sutiles) */}
          <div className="absolute bottom-1 left-4 w-4 h-1 bg-[#101010] rounded-full opacity-50"></div>
          <div className="absolute bottom-1 right-4 w-4 h-1 bg-[#101010] rounded-full opacity-50"></div>
        </div>
        
      </div>
    </div>
  );
}