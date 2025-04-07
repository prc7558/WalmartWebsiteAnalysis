import { ChartLine, HelpCircle, Moon, Sun } from "lucide-react";

interface AppHeaderProps {
  onHelpClick: () => void;
  onThemeToggle: () => void;
  isDarkTheme: boolean;
}

export default function AppHeader({ onHelpClick, onThemeToggle, isDarkTheme }: AppHeaderProps) {
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <ChartLine className="text-white text-2xl" />
          <h1 className="text-white text-xl font-semibold">Walmart Sales Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onHelpClick}
            className="text-white hover:bg-secondary p-2 rounded-full transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <button
            onClick={onThemeToggle}
            className="text-white hover:bg-secondary p-2 rounded-full transition-colors"
            aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
