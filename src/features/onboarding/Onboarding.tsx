import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/common/Icon';
import { onboardingSlides } from '@/data/onboarding';

const KEY = 'ab_onboarded';

export function hasSeenOnboarding(): boolean {
  try { return localStorage.getItem(KEY) === '1'; } catch { return true; }
}

/** First-visit intro with 4 slides. */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const finish = () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* storage unavailable */ }
    onDone();
  };
  const next = () => (i < onboardingSlides.length - 1 ? setI(i + 1) : finish());
  const slide = onboardingSlides[i];

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Giới thiệu" className="animate-fade fixed inset-0 z-(--z-modal) flex flex-col bg-page">
      <div className="flex justify-end px-4 pt-4">
        <button type="button" onClick={finish} className="flex items-center gap-1 text-[17px] font-semibold text-primary">
          Bỏ Qua <Icon name="chevron-right" size={20} strokeWidth={2.4} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6">
        <img key={slide.image} src={slide.image} alt="" className="animate-fade aspect-[640/556] max-h-[62vh] w-auto max-w-full rounded-[40px] object-cover" />
        <h2 className="mt-10 text-center text-xl font-semibold text-ink">{slide.title}</h2>
        <p className="mt-4 text-center text-sm text-muted">{slide.text}</p>
        <div className="mt-12 flex items-center gap-2" aria-label={`Trang ${i + 1} / ${onboardingSlides.length}`}>
          {onboardingSlides.map((_, k) => (
            <button key={k} type="button" onClick={() => setI(k)} aria-label={`Trang ${k + 1}`}
              className={`h-2 rounded-full transition-all ${k === i ? 'w-8 bg-primary' : k < i ? 'w-2 bg-primary' : 'w-2 bg-[#9aa29e]'}`} />
          ))}
        </div>
      </div>
      <div className="border-t border-line p-4">
        <button type="button" onClick={next} className="h-10 w-full rounded-lg bg-primary text-[15px] font-bold text-white hover:bg-primary-dark">Tiếp tục</button>
      </div>
    </div>,
    document.body,
  );
}
