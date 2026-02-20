import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-10 px-4 md:px-20">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Ad Space */}
        <div className="hidden md:block md:w-1/6 bg-yellow-100 text-center p-2 rounded shadow-inner">
          <p className="text-sm font-medium text-yellow-800">Ad Space</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 md:p-10">
          <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">About Me</h1>

          {/* Section 1: Introduction */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">👋 Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Hello! My name is <strong>Mir Ishfaq Ahmad</strong>. I'm a passionate student and tech enthusiast deeply interested in educational opportunities worldwide.
              After exploring many international and fully funded scholarships myself, I realized there was a strong need for a central platform where students from around the globe could easily discover and apply for scholarships.
            </p>
          </div>

          {/* Section 2: Education */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">🎓 Education</h2>
            <p className="text-gray-700 leading-relaxed">
              I graduated in <strong>2024</strong> with a Bachelor's degree in <strong>Computer Science</strong> from the <strong>University of Malakand</strong>. During my academic years, I was always active in tech, web development, and guiding others in finding career-boosting scholarships and programs.
            </p>
          </div>

          {/* Section 3: Why This Website */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">🌐 Why I Created This Website</h2>
            <p className="text-gray-700 leading-relaxed">
              After researching dozens of international scholarships—ranging from undergraduate to PhD, internships, fellowships, and summer programs—I decided to build this website as a one-stop solution for global scholarship seekers.
              This platform is designed to make finding and applying to scholarships easy, organized, and accessible for all.
            </p>
          </div>

          {/* Section 4: My Experience */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">💼 My Experience</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Developed several web applications using React.js, Tailwind CSS, and Node.js</li>
              <li>Built a scholarship listing platform for global users</li>
              <li>Worked on real-world projects including e-commerce, educational portals, and admin dashboards</li>
              <li>Guided students on how to apply for international programs</li>
              <li>Regularly research and share new scholarships through my platform</li>
            </ul>
          </div>

          {/* Section 5: Mission */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">🎯 My Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              My mission is to help thousands of students from underrepresented regions to access world-class opportunities for free education. This website is just the beginning of my journey to empower global youth with information, guidance, and a path to success.
            </p>
          </div>
        </div>

        {/* Right Ad Space */}
        <div className="hidden md:block md:w-1/6 bg-yellow-100 text-center p-2 rounded shadow-inner">
          <p className="text-sm font-medium text-yellow-800">Ad Space</p>
        </div>
      </div>
    </div>
  );
};

export default About;
