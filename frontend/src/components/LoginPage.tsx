import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import gameDevice from "@/assets/game-device.png";

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, register, isLoading } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.firstname) {
        newErrors.firstname = "First name is required";
      }
      if (!formData.lastname) {
        newErrors.lastname = "Last name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrors({});
    
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password
        });
      }
    } catch (err: any) {
      setErrors({
        submit: err.message || 'Authentication failed'
      });
    }
  };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url(${gameDevice})`,
            backgroundSize: '150px 200px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="card-pixel bg-card border-foreground">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-pixel text-xl text-card-foreground">
              {isLogin ? "PLAYER LOGIN" : "NEW TRAINER"}
            </CardTitle>
            <div className="w-full h-0.5 bg-accent mt-2"></div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                <p className="font-pixel text-xs text-destructive text-center">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-pixel text-xs text-card-foreground">
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email..."
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input-pixel font-pixel text-sm ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="font-pixel text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Additional fields for signup */}
            {!isLogin && (
              <>
                <div className="space-y-2 animate-pixel-slide-in">
                  <Label htmlFor="firstname" className="font-pixel text-xs text-card-foreground">
                    FIRST NAME
                  </Label>
                  <Input
                    id="firstname"
                    placeholder="Enter first name..."
                    value={formData.firstname}
                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                    className={`input-pixel font-pixel text-sm ${errors.firstname ? 'border-destructive' : ''}`}
                  />
                  {errors.firstname && (
                    <p className="font-pixel text-xs text-destructive">{errors.firstname}</p>
                  )}
                </div>

                <div className="space-y-2 animate-pixel-slide-in">
                  <Label htmlFor="lastname" className="font-pixel text-xs text-card-foreground">
                    LAST NAME
                  </Label>
                  <Input
                    id="lastname"
                    placeholder="Enter last name..."
                    value={formData.lastname}
                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                    className={`input-pixel font-pixel text-sm ${errors.lastname ? 'border-destructive' : ''}`}
                  />
                  {errors.lastname && (
                    <p className="font-pixel text-xs text-destructive">{errors.lastname}</p>
                  )}
                </div>
              </>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-pixel text-xs text-card-foreground">
                SECRET CODE
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password..."
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input-pixel font-pixel text-sm ${errors.password ? 'border-destructive' : ''}`}
                />
                {/* Pixel hearts for password strength */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      size={8}
                      className={`${
                        formData.password.length > i * 2 ? 'text-destructive' : 'text-muted'
                      } transition-colors`}
                      fill={formData.password.length > i * 2 ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
              {errors.password && (
                <p className="font-pixel text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field for signup */}
            {!isLogin && (
              <div className="space-y-2 animate-pixel-slide-in">
                <Label htmlFor="confirmPassword" className="font-pixel text-xs text-card-foreground">
                  CONFIRM CODE
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password..."
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`input-pixel font-pixel text-sm ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="font-pixel text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                variant="pixel"
                size="pixel"
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {isLogin ? "LOGGING IN..." : "CREATING..."}
                  </>
                ) : isLogin ? (
                  <>
                    <LogIn className="mr-2" size={16} />
                    START GAME
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2" size={16} />
                    CREATE TRAINER
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-pixel text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  {isLogin ? "NEW PLAYER? SIGN UP" : "HAVE ACCOUNT? LOG IN"}
                </button>
              </div>
            </div>
            </form>

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-4 pt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-accent border border-foreground animate-sparkle"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="text-center mt-6">
          <p className="font-pixel text-xs text-foreground/60">
            READY TO CATCH EM ALL?
          </p>
        </div>
      </div>
    </div>
  );
};