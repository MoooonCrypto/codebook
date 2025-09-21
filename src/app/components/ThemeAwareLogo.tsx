'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ThemeAwareLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ThemeAwareLogo({
  className = "w-full h-full object-cover rounded",
  width = 40,
  height = 40
}: ThemeAwareLogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ハイドレーション後にマウント状態を設定
  useEffect(() => {
    setMounted(true);
  }, []);

  // クライアントサイドでマウントされるまではフォールバックSVGを表示
  if (!mounted) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <style>
            {`.st0{fill:#000000;} .st1{fill:#FFFFFF;} .st2{fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;}`}
          </style>
        </defs>
        <path
          className="st0"
          d="M20,15h50c8.3,0,15,6.7,15,15v40c0,8.3-6.7,15-15,15H30c-8.3,0-15-6.7-15-15V15z"
        />
        <rect
          className="st1"
          x="25"
          y="20"
          width="50"
          height="45"
          rx="5"
          ry="5"
        />
        <polyline className="st2" points="35,35 40,40 35,45" />
        <polyline className="st2" points="55,35 50,40 55,45" />
        <line className="st2" x1="45" y1="30" x2="42" y2="50" />
        <rect
          className="st0"
          x="80"
          y="20"
          width="10"
          height="60"
          rx="5"
          ry="5"
        />
      </svg>
    );
  }

  // テーマに応じてロゴ画像のパスを決定
  const logoSrc = theme === 'dark' ? '/logo_black.PNG' : '/logo_white.PNG';

  return (
    <>
      <Image
        src={logoSrc}
        alt="CodeBook Logo"
        width={width}
        height={height}
        className={className}
        unoptimized
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling?.classList.remove('hidden');
        }}
      />
      {/* フォールバック用SVGアイコン */}
      <svg viewBox="0 0 100 100" className={`${className} hidden`}>
        <defs>
          <style>
            {`.st0{fill:#000000;} .st1{fill:#FFFFFF;} .st2{fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;}`}
          </style>
        </defs>
        <path
          className="st0"
          d="M20,15h50c8.3,0,15,6.7,15,15v40c0,8.3-6.7,15-15,15H30c-8.3,0-15-6.7-15-15V15z"
        />
        <rect
          className="st1"
          x="25"
          y="20"
          width="50"
          height="45"
          rx="5"
          ry="5"
        />
        <polyline className="st2" points="35,35 40,40 35,45" />
        <polyline className="st2" points="55,35 50,40 55,45" />
        <line className="st2" x1="45" y1="30" x2="42" y2="50" />
        <rect
          className="st0"
          x="80"
          y="20"
          width="10"
          height="60"
          rx="5"
          ry="5"
        />
      </svg>
    </>
  );
}