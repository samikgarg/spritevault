import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Grid3X3, 
  Plus, 
  Settings, 
  LogOut, 
  Heart, 
  Star,
  Upload,
  Users
} from "lucide-react";
import spriteCreature from "@/assets/sprite-creature.png";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedSprite, setSelectedSprite] = useState<number | null>(null);

  // Mock data for sprites
  const sprites = [
    { id: 1, name: "Flamepup", type: "Fire", rarity: "Common", team: "Alpha Squad" },
    { id: 2, name: "Leafwhisk", type: "Grass", rarity: "Rare", team: "Beta Team" },
    { id: 3, name: "Bubblefin", type: "Water", rarity: "Epic", team: "Alpha Squad" },
    { id: 4, name: "Sparkwing", type: "Electric", rarity: "Legendary", team: null },
    { id: 5, name: "Rocktail", type: "Ground", rarity: "Common", team: "Beta Team" },
    { id: 6, name: "Mistclaw", type: "Ice", rarity: "Rare", team: null },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-muted text-muted-foreground";
      case "Rare": return "bg-primary text-primary-foreground";
      case "Epic": return "bg-secondary text-secondary-foreground";
      case "Legendary": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header HUD */}
      <header className="bg-card border-b-2 border-foreground p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary border-2 border-foreground flex items-center justify-center">
              <img
                src={spriteCreature}
                alt="Player Avatar"
                className="w-8 h-8 pixel-perfect"
              />
            </div>
            <div>
              <h1 className="font-pixel text-sm text-card-foreground">
                TRAINER {user?.firstname?.toUpperCase() || 'UNKNOWN'}
              </h1>
              <div className="flex items-center gap-2">
                <Heart className="text-destructive" size={12} fill="currentColor" />
                <span className="font-pixel text-xs text-card-foreground">HP: 100</span>
                <Star className="text-accent ml-2" size={12} fill="currentColor" />
                <span className="font-pixel text-xs text-card-foreground">LEVEL: 25</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "TOTAL SPRITES", value: "47", icon: Grid3X3 },
            { label: "TEAMS", value: "3", icon: Users },
            { label: "RARE FINDS", value: "12", icon: Star },
            { label: "UPLOADS", value: "8", icon: Upload },
          ].map((stat, i) => (
            <Card key={stat.label} className="card-pixel bg-card animate-pixel-pop" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-4 text-center">
                <stat.icon className="mx-auto mb-2 text-card-foreground" size={20} />
                <div className="font-pixel text-xl text-card-foreground">{stat.value}</div>
                <div className="font-pixel text-xs text-card-foreground/80">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sprite Collection Grid */}
          <div className="lg:col-span-2">
            <Card className="card-pixel bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="font-pixel text-lg text-card-foreground">
                  SPRITE COLLECTION
                </CardTitle>
                <Button variant="pixel" size="sm">
                  <Plus className="mr-1" size={14} />
                  ADD NEW
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sprites.map((sprite) => (
                    <div
                      key={sprite.id}
                      className={`card-pixel p-3 cursor-pointer transition-all hover:scale-105 ${
                        selectedSprite === sprite.id ? 'bg-accent/20 border-accent' : 'bg-card-foreground/5'
                      }`}
                      onClick={() => setSelectedSprite(sprite.id)}
                    >
                      <img
                        src={spriteCreature}
                        alt={sprite.name}
                        className="w-full aspect-square pixel-perfect sprite-bounce mb-2"
                        style={{ animationDelay: `${sprite.id * 0.1}s` }}
                      />
                      <div className="text-center">
                        <h3 className="font-pixel text-xs text-card-foreground mb-1">
                          {sprite.name.slice(0, 8)}
                        </h3>
                        <Badge className={`${getRarityColor(sprite.rarity)} font-pixel text-xs`}>
                          {sprite.rarity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Selected Sprite Info */}
            {selectedSprite && (
              <Card className="card-pixel bg-card animate-pixel-slide-in">
                <CardHeader>
                  <CardTitle className="font-pixel text-md text-card-foreground">
                    SPRITE INFO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const sprite = sprites.find(s => s.id === selectedSprite);
                    return sprite ? (
                      <div className="space-y-3">
                        <img
                          src={spriteCreature}
                          alt={sprite.name}
                          className="w-20 h-20 mx-auto pixel-perfect sprite-bounce"
                        />
                        <div className="text-center">
                          <h3 className="font-pixel text-sm text-card-foreground">
                            {sprite.name}
                          </h3>
                          <p className="font-pixel text-xs text-card-foreground/80">
                            TYPE: {sprite.type}
                          </p>
                          <Badge className={`${getRarityColor(sprite.rarity)} font-pixel text-xs mt-2`}>
                            {sprite.rarity}
                          </Badge>
                        </div>
                        <div className="border-t border-foreground pt-3">
                          <p className="font-pixel text-xs text-card-foreground/80 mb-2">
                            TEAM: {sprite.team || "NONE"}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="pixel" size="sm" className="text-xs">
                              EDIT
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs font-pixel">
                              SHARE
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="card-pixel bg-card">
              <CardHeader>
                <CardTitle className="font-pixel text-md text-card-foreground">
                  QUICK ACTIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="pixel" size="sm" className="w-full">
                  <Upload className="mr-2" size={14} />
                  UPLOAD SPRITE
                </Button>
                <Button variant="outline" size="sm" className="w-full font-pixel">
                  <Users className="mr-2" size={14} />
                  MANAGE TEAMS
                </Button>
                <Button variant="ghost" size="sm" className="w-full font-pixel">
                  <Settings className="mr-2" size={14} />
                  SETTINGS
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};