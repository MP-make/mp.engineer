import { ExternalLink, Github } from 'lucide-react';

interface HeroImage {
  id: number;
  image: string;
  title?: string;
  order: number;
}

interface HeroSectionProps {
  t: any;
  theme: string;
  currentSlide: number;
  heroImages: HeroImage[];
  isImageOnLeft: boolean;
}

export default function HeroSection({ t, theme, currentSlide, heroImages, isImageOnLeft }: HeroSectionProps) {
  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-400/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="hidden lg:block w-full min-h-screen">
        {/* isImageOnLeft=false significa imagen a la DERECHA (flex-row-reverse pone imagen derecha) */}
        <div className={`flex w-full min-h-screen transition-all duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${!isImageOnLeft ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Content Side */}
          <div className={`w-1/2 h-screen sticky top-0 flex items-center ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
            <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
              <div className="relative min-h-[220px] mb-8">
                {t.hero.slides.map((slide: any, index: number) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      currentSlide % t.hero.slides.length === index 
                        ? 'opacity-100 translate-y-0 blur-0' 
                        : 'opacity-0 translate-y-8 blur-sm pointer-events-none'
                    }`}
                  >
                    <h1 className={`text-4xl sm:text-5xl xl:text-6xl font-heading font-bold leading-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <span className="text-primary">{slide.title.split(' ')[0]}</span>{' '}
                      {slide.title.split(' ').slice(1).join(' ')}
                    </h1>
                    <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed max-w-md`}>
                      {slide.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full ${theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.hero.available}</span>
                </div>
              </div>

              <div className="mb-10">
                <a href="#contact" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 text-lg">
                  {t.hero.connect}
                  <ExternalLink size={20} />
                </a>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#projects" className={`px-6 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 hover:border-primary text-gray-400 hover:text-primary' : 'border-gray-300 hover:border-primary text-gray-600 hover:text-primary'} rounded-xl font-medium transition-all duration-300`}>
                  {t.hero.viewProjects}
                </a>
                <a href="https://github.com/MP-make" target="_blank" rel="noopener noreferrer" className={`px-6 py-3 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'} rounded-xl font-medium transition-all duration-300 flex items-center gap-2`}>
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="w-1/2 h-screen sticky top-0 pt-16 overflow-hidden">
            <div className="relative w-full h-full">
              {heroImages.length > 0 ? (
                heroImages.map((img) => (
                  <div
                    key={img.id}
                    className={`absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      currentSlide % heroImages.length === (img.order - 1) 
                        ? 'opacity-100 scale-100 blur-0' 
                        : 'opacity-0 scale-110 blur-sm'
                    }`}
                  >
                    <img src={img.image} alt={img.title || 'Hero'} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'}`}></div>
                  </div>
                ))
              ) : (
                <div className={`w-full h-full ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a1f2e] to-[#0f1419]' : 'bg-gradient-to-br from-gray-200 to-gray-300'} flex items-center justify-center`}>
                  <div className="text-primary/30 text-6xl">💻</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className={`lg:hidden w-full min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
        <div className="w-full pt-20 px-6">
          <div className="relative min-h-[180px] mb-6">
            {t.hero.slides.map((slide: any, index: number) => (
              <div key={index} className={`absolute inset-0 transition-all duration-700 ${currentSlide % t.hero.slides.length === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <h1 className={`text-3xl font-heading font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-primary">{slide.title.split(' ')[0]}</span> {slide.title.split(' ').slice(1).join(' ')}
                </h1>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{slide.subtitle}</p>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-green-500"></span></span>
              <span className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.hero.available}</span>
            </div>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl mb-6">{t.hero.connect}<ExternalLink size={18} /></a>
        </div>
        <div className="px-6 pb-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
            {heroImages.map((img) => (
              <img key={img.id} src={img.image} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentSlide % heroImages.length === (img.order - 1) ? 'opacity-100' : 'opacity-0'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}