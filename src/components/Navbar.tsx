import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="#home" className="text-cyan-400 font-bold text-xl">
              MP.Engineer
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#home" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
            <a href="#about" className="text-gray-300 hover:text-cyan-400 transition-colors">About Me</a>
            <a href="#projects" className="text-gray-300 hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;