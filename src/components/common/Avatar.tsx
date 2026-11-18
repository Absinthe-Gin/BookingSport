import { useState } from 'react';

const palette = ['#006d38', '#1f6feb', '#b4229e', '#e8590c', '#0f766e', '#7c3aed'];

export function Avatar({ src, name, size = 56, className = '' }: { src?: string | null; name: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const color = palette[name.length % palette.length];
  const style = { width: size, height: size };
  if (src && !failed) {
    return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} style={style} className={`shrink-0 rounded-full bg-white object-cover ${className}`} />;
  }
  return (
    <span aria-hidden="true" style={{ ...style, background: color, fontSize: size * 0.36 }}
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${className}`}>
      {initials}
    </span>
  );
}
