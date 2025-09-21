'use client';

interface LanguageGridProps {
  onLanguageClick: (language: string) => void;
  className?: string;
}

const languages = [
  { name: 'JavaScript', icon: '🟨', color: 'bg-yellow-100 hover:bg-yellow-200' },
  { name: 'TypeScript', icon: '🔷', color: 'bg-blue-100 hover:bg-blue-200' },
  { name: 'Python', icon: '🐍', color: 'bg-green-100 hover:bg-green-200' },
  { name: 'Java', icon: '☕', color: 'bg-orange-100 hover:bg-orange-200' },
  { name: 'C++', icon: '⚙️', color: 'bg-gray-100 hover:bg-gray-200' },

  { name: 'React', icon: '⚛️', color: 'bg-cyan-100 hover:bg-cyan-200' },
  { name: 'Vue', icon: '💚', color: 'bg-emerald-100 hover:bg-emerald-200' },
  { name: 'Angular', icon: '🅰️', color: 'bg-red-100 hover:bg-red-200' },
  { name: 'Node.js', icon: '🟢', color: 'bg-green-100 hover:bg-green-200' },
  { name: 'Go', icon: '🐹', color: 'bg-blue-100 hover:bg-blue-200' },

  { name: 'Rust', icon: '🦀', color: 'bg-orange-100 hover:bg-orange-200' },
  { name: 'Swift', icon: '🍎', color: 'bg-orange-100 hover:bg-orange-200' },
  { name: 'Kotlin', icon: '💜', color: 'bg-purple-100 hover:bg-purple-200' },
  { name: 'C#', icon: '💙', color: 'bg-blue-100 hover:bg-blue-200' },
  { name: 'PHP', icon: '🐘', color: 'bg-indigo-100 hover:bg-indigo-200' },

  { name: 'Ruby', icon: '💎', color: 'bg-red-100 hover:bg-red-200' },
  { name: 'Dart', icon: '🎯', color: 'bg-blue-100 hover:bg-blue-200' },
  { name: 'Flutter', icon: '📱', color: 'bg-blue-100 hover:bg-blue-200' },
  { name: 'HTML', icon: '🌐', color: 'bg-orange-100 hover:bg-orange-200' },
  { name: 'CSS', icon: '🎨', color: 'bg-blue-100 hover:bg-blue-200' },

  { name: 'SQL', icon: '🗄️', color: 'bg-gray-100 hover:bg-gray-200' },
  { name: 'Docker', icon: '🐳', color: 'bg-blue-100 hover:bg-blue-200' },
  { name: 'AWS', icon: '☁️', color: 'bg-yellow-100 hover:bg-yellow-200' },
  { name: 'Git', icon: '📝', color: 'bg-orange-100 hover:bg-orange-200' },
  { name: 'Shell', icon: '🔧', color: 'bg-gray-100 hover:bg-gray-200' },
];

export function LanguageGrid({ onLanguageClick, className = '' }: LanguageGridProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        プログラミング言語・技術
      </h3>
      <div className="grid grid-cols-5 gap-4">
        {languages.map((language) => (
          <button
            key={language.name}
            onClick={() => onLanguageClick(language.name.toLowerCase())}
            className={`flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600
                       ${language.color} dark:bg-gray-700 dark:hover:bg-gray-600
                       transition-colors duration-200 group`}
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {language.icon}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
              {language.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}