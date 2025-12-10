'use client';

import { ArrowRight, CheckCircle, Phone, Mail, MapPin, Clock, Users, Shield, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className={`fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 transition-all duration-300 ${scrollY > 50 ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`flex items-center transform transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 animate-pulse">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">LabReportHub Medical Services</span>
            </div>
            
            <nav className={`hidden md:flex space-x-8 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">Services</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">Contact</a>
            </nav>
            
            <button className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              Book Test
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Excellence</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>in</span>
                <br />
                <span className="text-blue-600 inline-block animate-fade-in-up" style={{ animationDelay: '0.6s' }}>Medical Care</span>
              </h1>
              <p className={`text-xl text-gray-600 mb-8 leading-relaxed transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Comprehensive medical services with compassionate care and advanced treatment. 
                Your health and wellbeing are our top priority with experienced specialists and modern facilities.
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-xl group">
                  Book Appointment
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Our Services
                </button>
              </div>
            </div>
            
            <div className={`relative transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-500 transform hover:scale-102">
                <div className="flex items-center mb-6 animate-slide-in-right">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 animate-pulse">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Care</h3>
                    <p className="text-gray-600">Professional medical consultation</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "General Medicine", delay: "0.1s" },
                    { name: "Cardiology Services", delay: "0.2s" },
                    { name: "Specialist Consultations", delay: "0.3s" }
                  ].map((test, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-102 animate-fade-in-up"
                      style={{ animationDelay: test.delay }}
                    >
                      <span className="text-gray-700">{test.name}</span>
                      <span className="text-green-600 font-semibold animate-bounce">✓ Available</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Why Choose LabReportHub Medical Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Leading medical center providing comprehensive healthcare services 
              with experienced doctors and state-of-the-art medical facilities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Licensed Professionals",
                description: "Board-certified physicians and licensed medical professionals",
                color: "blue",
                delay: "0.1s"
              },
              {
                icon: Clock,
                title: "24/7 Emergency Care", 
                description: "Round-the-clock emergency services and urgent care availability",
                color: "green",
                delay: "0.2s"
              },
              {
                icon: Users,
                title: "Specialized Doctors",
                description: "Experienced specialists across multiple medical disciplines", 
                color: "purple",
                delay: "0.3s"
              },
              {
                icon: Award,
                title: "Modern Equipment",
                description: "Latest medical technology and diagnostic equipment",
                color: "orange", 
                delay: "0.4s"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses: Record<string, string> = {
                blue: "bg-blue-100 text-blue-600",
                green: "bg-green-100 text-green-600", 
                purple: "bg-purple-100 text-purple-600",
                orange: "bg-orange-100 text-orange-600"
              };
              
              return (
                <div 
                  key={index}
                  className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up group"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className={`w-16 h-16 ${colorClasses[feature.color]} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-600">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Our Medical Services
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Complete medical care across all specialties and departments
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "General Medicine",
                description: "Primary healthcare, routine check-ups, preventive care, and chronic disease management",
                tests: ["Health Screenings", "Chronic Care", "Preventive Medicine", "Wellness Programs"],
                delay: "0.1s"
              },
              {
                title: "Cardiology",
                description: "Heart disease diagnosis, cardiac procedures, and cardiovascular health management",
                tests: ["ECG/EKG", "Echocardiogram", "Stress Testing", "Heart Monitoring"],
                delay: "0.2s"
              },
              {
                title: "Orthopedics",
                description: "Bone and joint care, sports medicine, fracture treatment, and rehabilitation",
                tests: ["X-Ray Imaging", "Joint Injections", "Physical Therapy", "Bone Density"],
                delay: "0.3s"
              },
              {
                title: "Pediatrics",
                description: "Comprehensive child healthcare, vaccinations, growth monitoring, and pediatric specialties",
                tests: ["Child Check-ups", "Vaccinations", "Growth Assessment", "Pediatric Care"],
                delay: "0.4s"
              },
              {
                title: "Women's Health",
                description: "Gynecological care, obstetrics, prenatal care, and women's wellness services",
                tests: ["Prenatal Care", "Gynecology", "Family Planning", "Women's Wellness"],
                delay: "0.5s"
              },
              {
                title: "Dermatology",
                description: "Skin care, dermatological conditions, cosmetic procedures, and skin health",
                tests: ["Skin Examination", "Mole Screening", "Acne Treatment", "Cosmetic Care"],
                delay: "0.6s"
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up group"
                style={{ animationDelay: service.delay }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-blue-600">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.tests.map((test, testIndex) => (
                    <li key={testIndex} className="flex items-center text-sm text-gray-700 transform transition-all duration-300 hover:translate-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 animate-pulse" />
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-600 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "25,000+", label: "Patients Treated", delay: "0.1s" },
              { number: "99.2%", label: "Patient Satisfaction", delay: "0.2s" },
              { number: "24/7", label: "Emergency Services", delay: "0.3s" },
              { number: "20+", label: "Years of Excellence", delay: "0.4s" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="animate-fade-in-up transform hover:scale-110 transition-all duration-300"
                style={{ animationDelay: stat.delay }}
              >
                <div className="text-4xl font-bold mb-2 animate-counter">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Schedule your appointment or contact us for more information
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="animate-fade-in-left">
              <div className="space-y-6">
                {[
                  { Icon: Phone, title: "Phone", info: "+1 (555) 123-4567", delay: "0.1s" },
                  { Icon: Mail, title: "Email", info: "LabReportHub.com", delay: "0.2s" },
                  { Icon: MapPin, title: "Location", info: "456 Healthcare Plaza\nMedical District, MD 54321", delay: "0.3s" },
                  { Icon: Clock, title: "Hours", info: "Mon-Fri: 7:00 AM - 6:00 PM\nSat: 8:00 AM - 2:00 PM\nSun: Emergency only", delay: "0.4s" }
                ].map((contact, index) => {
                  const Icon = contact.Icon;
                  return (
                    <div 
                      key={index}
                      className="flex items-center animate-fade-in-up transform hover:translate-x-2 transition-all duration-300 group"
                      style={{ animationDelay: contact.delay }}
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-110">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">{contact.title}</h3>
                        <p className="text-gray-600 whitespace-pre-line">{contact.info}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl animate-fade-in-right">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                    />
                  </div>
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                    />
                  </div>
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                  />
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                  />
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                  ></textarea>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fade-in-up">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 animate-pulse">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-xl font-bold">LabReportHub Medical Services</span>
              </div>
              <p className="text-gray-400 mb-4">
                Comprehensive medical services with compassionate care and advanced healthcare solutions.
              </p>
              <div className="flex space-x-4">
                {['f', 't', 'in'].map((social, index) => (
                  <div 
                    key={index}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                  >
                    <span className="text-sm font-bold">{social}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {[
              { title: "Services", links: ["Clinical Chemistry", "Hematology", "Microbiology", "Immunology"] },
              { title: "Quick Links", links: ["About Us", "Medical Services", "Patient Portal", "Careers"] },
              { title: "Contact Info", links: ["+1 (555) 123-4567", "info@LabReportHub.com", "456 Healthcare Plaza", "Medical District, MD 54321"] }
            ].map((section, sectionIndex) => (
              <div key={sectionIndex} className="animate-fade-in-up" style={{ animationDelay: `${0.2 * (sectionIndex + 1)}s` }}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <p>&copy; 2024 LabReportHub Medical Services. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}