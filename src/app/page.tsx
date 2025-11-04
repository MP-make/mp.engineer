import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import { Code, Database, Smartphone, Mail, Github, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Home Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Marlon <span className="text-cyan-400">Pecho</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Advanced Systems Engineering Student & Full-Stack Developer
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Passionate about creating innovative solutions through code. Seeking Junior/Internship opportunities to apply my skills in Full-Stack Development, Data Management, and UX/UI Design.
          </p>
          <div className="mt-8">
            <a href="#contact" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Professional Summary</h3>
              <p className="text-gray-300 mb-6">
                As an advanced student in Systems Engineering, I specialize in full-stack development with a focus on modern technologies. My experience spans from backend data management to frontend user interfaces, always prioritizing clean, efficient, and scalable solutions.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Experience</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-cyan-400 font-semibold">Full-Stack Development</h4>
                  <p className="text-gray-300">Building end-to-end web applications using modern frameworks and best practices.</p>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold">Data Management</h4>
                  <p className="text-gray-300">Designing and implementing efficient database solutions and data processing pipelines.</p>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold">UX/UI Design</h4>
                  <p className="text-gray-300">Creating intuitive and responsive user interfaces with attention to user experience.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Code className="text-cyan-400" size={24} />
                  <span>Python</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="text-cyan-400" size={24} />
                  <span>SQL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="text-cyan-400" size={24} />
                  <span>Next.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="text-cyan-400" size={24} />
                  <span>TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="text-cyan-400" size={24} />
                  <span>React</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="text-cyan-400" size={24} />
                  <span>Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
              <h3 className="text-xl font-semibold mb-2">E-Commerce Platform</h3>
              <p className="text-gray-300 mb-4">A full-stack e-commerce solution with user authentication, product management, and payment integration.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">Next.js</span>
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">TypeScript</span>
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">PostgreSQL</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="flex items-center text-cyan-400 hover:text-cyan-300">
                  <ExternalLink size={16} className="mr-1" />
                  Live Demo
                </a>
                <a href="#" className="flex items-center text-cyan-400 hover:text-cyan-300">
                  <Github size={16} className="mr-1" />
                  Code
                </a>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Data Analytics Dashboard</h3>
              <p className="text-gray-300 mb-4">Interactive dashboard for data visualization and analysis using Python and modern web technologies.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">Python</span>
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">React</span>
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">D3.js</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="flex items-center text-cyan-400 hover:text-cyan-300">
                  <ExternalLink size={16} className="mr-1" />
                  Live Demo
                </a>
                <a href="#" className="flex items-center text-cyan-400 hover:text-cyan-300">
                  <Github size={16} className="mr-1" />
                  Code
                </a>
              </div>
            </div>

            {/* Project 3 */}
            <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Task Management App</h3>
              <p className="text-gray-300 mb-4">Collaborative task management application with real-time updates and team features.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">Next.js</span>
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">Socket.io</span>
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded">MongoDB</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="flex items-center text-cyan-400 hover:text-cyan-300">
                  <ExternalLink size={16} className="mr-1" />
                  Live Demo
                </a>
                <a href="#" className="flex items-center text-cyan-400 hover:text-cyan-300">
                  <Github size={16} className="mr-1" />
                  Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Contact Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Let&apos;s Connect</h3>
              <p className="text-gray-300 mb-6">
                I&apos;m always interested in new opportunities and collaborations. Feel free to reach out!
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-cyan-400 mr-3" size={20} />
                  <span>marlonpecho264@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="text-cyan-400 mr-3" size={20} />
                  <span>907-326-121</span>
                </div>
              </div>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">&copy; 2025 Marlon Pecho. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
