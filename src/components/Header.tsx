import { Leaf, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onGetStarted: () => void;
}

export const Header = ({ onGetStarted }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            EcoAwards
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
        </nav>

        <Button onClick={onGetStarted} variant="hero" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Get Started
        </Button>
      </div>
    </header>
  );
};
