import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Play } from "lucide-react";
import pixelLandscape from "@/assets/pixel-landscape.png";
import spriteCreature from "@/assets/sprite-creature.png";
import api from "@/lib/axios";

export const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-grass relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 opacity-80 animate-scroll-bg pixel-perfect"
        style={{
          backgroundImage: `url(${pixelLandscape})`,
          backgroundSize: '200px 120px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom',
        }}
      />
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute text-accent sparkle pixel-perfect`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
            size={16}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-pixel text-foreground mb-4 drop-shadow-lg">
            SPRITEVAULT
          </h1>
          <h2 className="text-lg md:text-xl font-pixel text-foreground/90 mb-2">
            SPRITE COLLECTION
          </h2>
          <div className="w-full h-1 bg-accent border border-foreground"></div>
        </div>

        {/* Animated Creature */}
        <div className="mb-8">
          <img
            src={spriteCreature}
            alt="Pixel creature"
            className="w-24 h-24 pixel-perfect sprite-bounce"
          />
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <Button
            variant="retro"
            size="pixel"
            className="mb-4 relative"
            onClick={() => {
              // Let's make an authenticated request to test token refresh
              const currentToken = localStorage.getItem('token');
              console.log('Current token:', currentToken?.slice(0, 20) + '...');
              
              // This will trigger our axios interceptor if the token is expired
              api.get('/api/test-auth').catch(error => {
                console.log('Request error:', error.response?.status);
              });
            }}
          >
            TEST AUTH
          </Button>

          <Button
            variant="retro"
            size="pixel"
            className="mb-4 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Play className="mr-2" size={16} />
            START YOUR ADVENTURE
            {isHovered && (
              <Sparkles className="absolute -top-2 -right-2 text-accent animate-sparkle" size={12} />
            )}
          </Button>
          
          <p className="text-sm font-pixel text-foreground/80 max-w-md">
            Collect, create, and share pixel art creatures in this retro-inspired sprite manager
          </p>
        </div>

        {/* Feature Showcase */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          {[
            { title: "COLLECT", desc: "Gather sprites" },
            { title: "CREATE", desc: "Design creatures" },
            { title: "SHARE", desc: "Team up" },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="card-pixel p-4 text-center bg-card/90 animate-pixel-pop"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <h3 className="font-pixel text-sm text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="font-pixel text-xs text-card-foreground/80">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-secondary border-t-2 border-foreground"></div>
    </div>
  );
};