import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="w-full h-[calc(100vh-8rem)] relative overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://firebasestorage.googleapis.com/v0/b/codedual-37722.appspot.com/o/7xm.xyz800281.jpg?alt=media&token=4910535d-6f43-4e1c-93b5-f6e3a9a028a9')] bg-cover bg-center bg-no-repeat">
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl text-white">
            
            <h1 className="text-3xl lg:text-7xl mb-6 leading-tight">
              <span className="text-blue-500">
                Uniting Coding
              </span>{" "}
              Amplifying Brilliance!
            </h1>

            <p className="text-lg lg:text-2xl mb-8 text-gray-200">
              Code Connect: Collaborative coding excellence, uniting
              minds for superior solutions.
            </p>

            <Link
              to="/connect"
              className="inline-block px-10 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300 text-white font-semibold shadow-lg"
            >
              Explore
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;