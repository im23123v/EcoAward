import { Award, Sparkles, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface HeaderProps {
  onGetStarted: () => void;
}

export const Header = ({ onGetStarted }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <div className="glass-strong rounded-2xl shadow-elevated">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 gradient-hero rounded-xl blur-md opacity-50 animate-pulse-glow" />
                <div className="relative w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <span className="font-display text-xl font-bold text-foreground tracking-tight">
                EcoAwards
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-hero transition-all duration-300 group-hover:w-full" />
              </a>
              <a 
                href="#how-it-works" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-hero transition-all duration-300 group-hover:w-full" />
              </a>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={onGetStarted} 
                variant="hero" 
                size="sm" 
                className="hidden sm:flex gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Get Started
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/50 px-6 py-4 animate-fade-in">
              <nav className="flex flex-col gap-4">
                <a 
                  href="#features" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it Works
                </a>
                <Button onClick={onGetStarted} variant="hero" size="sm" className="w-full gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};