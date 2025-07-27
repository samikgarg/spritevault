import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";

type AppState = "landing" | "login" | "dashboard";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentState, setCurrentState] = useState<AppState>("landing");

  // Auto-navigate based on authentication state
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setCurrentState("dashboard");
      } else {
        setCurrentState("landing");
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleNavigation = (state: AppState) => {
    setCurrentState(state);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-pixel text-sm text-foreground">LOADING...</p>
        </div>
      </div>
    );
  }

  // Add click handlers to navigate between states
  const landingPageWithNavigation = () => (
    <div onClick={() => handleNavigation("login")}>
      <LandingPage />
    </div>
  );

  const loginPageWithNavigation = () => (
    <div>
      <LoginPage />
    </div>
  );

  switch (currentState) {
    case "landing":
      return landingPageWithNavigation();
    case "login":
      return loginPageWithNavigation();
    case "dashboard":
      return <Dashboard />;
    default:
      return landingPageWithNavigation();
  }
};

export default Index;
