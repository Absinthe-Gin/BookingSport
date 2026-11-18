import { useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { Icon } from '@/components/common/Icon';

interface FieldProps {
  label: ReactNode;
  error?: string;
  children: (id: string, describedBy: string | undefined) => ReactNode;
  labelClassName?: string;
}

export function Field({ label, error, children, labelClassName = 'text-primary-deep' }: FieldProps) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <label htmlFor={id} className={`mb-2.5 block text-[17px] font-bold ${labelClassName}`}>{label}</label>
      {children(id, error ? errId : undefined)}
      {error && <p id={errId} className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}

const inputBase = 'h-[50px] w-full rounded border border-line bg-white px-3 text-[15px] text-ink placeholder:text-[#8a948f] outline-none focus:border-primary aria-[invalid=true]:border-danger';

export function TextInput({ clearable, onClear, ...props }: InputHTMLAttributes<HTMLInputElement> & { clearable?: boolean; onClear?: () => void }) {
  return (
    <div className="relative">
      <input {...props} className={`${inputBase} ${clearable ? 'pr-11' : ''} ${props.className ?? ''}`} />
      {clearable && props.value && (
        <button type="button" onClick={onClear} aria-label="Xoá nội dung" className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-primary p-0.5 text-white">
          <Icon name="x" size={14} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? 'text' : 'password'} className={`${inputBase} pr-12`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-primary">
        <Icon name={show ? 'eye' : 'eye-off'} size={24} strokeWidth={2.2} />
      </button>
    </div>
  );
}

export function VnFlag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#da251d" />
      <path fill="#ffcd00" d="m10 4.5 1.3 4h4.2l-3.4 2.5 1.3 4L10 12.5 6.6 15l1.3-4-3.4-2.5h4.2z" />
    </svg>
  );
}

export function PhoneInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`flex h-[50px] items-center rounded border border-line bg-white focus-within:border-primary ${className}`}>
      <span className="flex items-center gap-2 pr-3 pl-3.5 text-sm text-ink">
        <VnFlag /> + 84 <Icon name="chevron-down" size={14} className="text-muted" />
      </span>
      <input {...props} type="tel" inputMode="tel" autoComplete="tel" className="h-full min-w-0 flex-1 rounded bg-transparent pr-3 text-[15px] outline-none placeholder:text-[#8a948f]" />
    </div>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`min-h-[56px] w-full resize-y rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none placeholder:text-[#8a948f] focus:border-primary ${props.className ?? ''}`} />;
}

export const PHONE_RE = /^(0|\+?84)?\d{9}$/;
export function isValidPhone(p: string) {
  return PHONE_RE.test(p.replace(/[\s.-]/g, ''));
}
