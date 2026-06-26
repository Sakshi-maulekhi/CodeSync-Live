import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] relative overflow-hidden flex items-center">
      
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://firebasestorage.googleapis.com/v0/b/codedual-37722.appspot.com/o/7xm.xyz800281.jpg?alt=media&token=4910535d-6f43-4e1c-93b5-f6e3a9a028a9')] bg-cover bg-center bg-no-repeat">
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full w-full py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            
            <h1 className="text-4xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Uniting Coding,
              </span>{" "}
              <br />
              Amplifying Brilliance!
            </h1>

            <p className="text-lg lg:text-xl mb-10 text-slate-300 max-w-xl font-light leading-relaxed">
              CodeSync: Collaborative coding excellence, uniting minds for superior solutions in real time.
            </p>

            <Link
              to="/connect"
              className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.03] transition-all duration-300"
            >
              Explore Rooms
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;