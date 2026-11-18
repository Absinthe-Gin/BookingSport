import { useState, type FormEvent } from 'react';
import { Link, useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { AuthLayout, useRedirectTarget } from '@/features/auth/AuthLayout';
import { Field, PasswordInput, PhoneInput, TextInput, isValidPhone } from '@/components/forms/Fields';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { ApiError } from '@/services/api';

const empty = { phone: '', email: '', fullName: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { state } = useRouterLocation();
  const target = useRedirectTarget(state);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof empty) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!isValidPhone(form.phone)) errs.phone = 'Số điện thoại không hợp lệ';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email không hợp lệ';
    if (form.fullName.trim().length < 2) errs.fullName = 'Vui lòng nhập họ và tên';
    if (form.password.length < 6) errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu nhập lại không khớp';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await register(form);
      toast.show('Đăng ký tài khoản thành công');
      navigate(target, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.errors);
      toast.show((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng ký">
      <form onSubmit={submit} noValidate className="mx-auto max-w-[560px] space-y-6 rounded-lg bg-white px-5 pt-6 pb-7">
        <Field label="Số điện thoại của bạn?" error={errors.phone}>
          {(id, d) => <PhoneInput id={id} aria-describedby={d} aria-invalid={!!errors.phone} value={form.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="Nhập số điện thoại" />}
        </Field>
        <Field label="Email của bạn?" error={errors.email}>
          {(id, d) => <TextInput id={id} aria-describedby={d} aria-invalid={!!errors.email} type="email" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} placeholder="Nhập email của bạn" clearable onClear={() => set('email')('')} />}
        </Field>
        <Field label="Tên đầy đủ (*)" error={errors.fullName}>
          {(id, d) => <TextInput id={id} aria-describedby={d} aria-invalid={!!errors.fullName} autoComplete="name" value={form.fullName} onChange={(e) => set('fullName')(e.target.value)} placeholder="Nhập họ và tên" clearable onClear={() => set('fullName')('')} />}
        </Field>
        <Field label="Mật khẩu (*)" error={errors.password}>
          {(id, d) => <PasswordInput id={id} aria-describedby={d} aria-invalid={!!errors.password} autoComplete="new-password" value={form.password} onChange={(e) => set('password')(e.target.value)} placeholder="Nhập mật khẩu (*)" />}
        </Field>
        <Field label="Nhập mật khẩu" error={errors.confirmPassword}>
          {(id, d) => <PasswordInput id={id} aria-describedby={d} aria-invalid={!!errors.confirmPassword} autoComplete="new-password" value={form.confirmPassword} onChange={(e) => set('confirmPassword')(e.target.value)} placeholder="Nhập lại mật khẩu" />}
        </Field>
        <Button type="submit" loading={loading} className="h-[50px] w-full rounded-md bg-primary-deep text-[15px]">ĐĂNG KÝ</Button>
      </form>
      <p className="mt-8 text-center text-[15px] text-white">
        Bạn đã có tài khoản? <Link to="/uLogin" state={state} className="font-bold">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}
