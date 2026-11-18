import { useState, type FormEvent } from 'react';
import { Link, useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { AuthLayout, useRedirectTarget } from '@/features/auth/AuthLayout';
import { Field, PasswordInput, PhoneInput, TextInput, isValidPhone } from '@/components/forms/Fields';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { useDialog } from '@/app/providers/DialogProvider';
import { ApiError } from '@/services/api';

type Mode = 'phone' | 'email';

function GoogleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const dialog = useDialog();
  const navigate = useNavigate();
  const { state } = useRouterLocation();
  const target = useRedirectTarget(state);
  const [mode, setMode] = useState<Mode>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (mode === 'phone' && !isValidPhone(phone)) errs.phone = 'Số điện thoại không hợp lệ';
    if (mode === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email không hợp lệ';
    if (!password) errs.password = 'Vui lòng nhập mật khẩu';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const user = await login(mode === 'phone' ? { phone, password } : { email, password });
      toast.show(`Xin chào, ${user.fullName}`);
      navigate(target, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.errors);
      toast.show((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const tab = (m: Mode, label: string) => (
    <button type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setErrors({}); }}
      className={`h-[70px] flex-1 text-[19px] font-bold ${mode === m ? 'bg-white text-primary-deep'
        : `bg-[#ececec] text-[#8a8f8c] shadow-[inset_0_-6px_8px_-6px_rgb(0_0_0/0.25)] ${m === 'email' ? 'rounded-bl-[30px]' : 'rounded-br-[30px]'}`}`}>
      {label}
    </button>
  );

  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={submit} noValidate className="overflow-hidden rounded-lg bg-white">
        <div role="tablist" className="flex">{tab('phone', 'Số điện thoại')}{tab('email', 'Email')}</div>
        <div className="space-y-6 px-5 pt-6 pb-7">
          {mode === 'phone' ? (
            <Field label="Số điện thoại của bạn?" error={errors.phone}>
              {(id, d) => <PhoneInput id={id} aria-describedby={d} aria-invalid={!!errors.phone} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại" />}
            </Field>
          ) : (
            <Field label="Email của bạn?" error={errors.email}>
              {(id, d) => <TextInput id={id} aria-describedby={d} aria-invalid={!!errors.email} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email của bạn" />}
            </Field>
          )}
          <Field label="Mật khẩu (*)" error={errors.password}>
            {(id, d) => <PasswordInput id={id} aria-describedby={d} aria-invalid={!!errors.password} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu (*)" />}
          </Field>
          <Button type="submit" loading={loading} className="h-[50px] w-full rounded-md bg-primary-deep text-[15px]">ĐĂNG NHẬP</Button>
          <p className="text-center text-sm text-ink">
            Bạn quên mật khẩu?{' '}
            <button type="button" onClick={() => dialog.alert('Vui lòng liên hệ hotline 0967 373 003 để được hỗ trợ đặt lại mật khẩu.')} className="font-bold text-primary-deep underline">Quên mật khẩu</button>
          </p>
        </div>
      </form>
      <p className="mt-8 text-center text-[15px] text-white">
        Bạn chưa có tài khoản? <Link to="/uRegister" state={state} className="font-bold">Đăng ký</Link>
      </p>
      <button type="button" onClick={() => toast.show('Đăng nhập với Google chưa được hỗ trợ trong bản này', 'error')}
        className="mx-auto mt-6 flex h-[42px] w-full max-w-[566px] items-center justify-center gap-2 rounded-md bg-white text-[17px] text-ink">
        <GoogleLogo />Đăng nhập với Google
      </button>
      <a href="https://alobo.vn" target="_blank" rel="noreferrer"
        className="mt-10 block rounded-sm border-2 border-accent bg-white px-12 py-3 text-center text-[17px] leading-8 text-accent underline"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 6px, rgb(226 176 51 / 0.9) 6px 9px)', backgroundSize: '44px 44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right top' }}>
        Nếu bạn là CHỦ SÂN hoặc NHÂN VIÊN, Bấm vào đây để tải ứng dụng ALOBO - Quản lý sân thể thao!
      </a>
    </AuthLayout>
  );
}
