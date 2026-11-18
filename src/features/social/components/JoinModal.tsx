import { useEffect, useState, type FormEvent } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { PhoneInput, TextInput, isValidPhone } from '@/components/forms/Fields';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { ApiError, api } from '@/services/api';
import { formatVnd } from '@shared/schedule';
import { ddmmyyyy } from '@/utils/date';
import type { SocialSession } from '@shared/types';

interface Props {
  session: SocialSession | null;
  venueName: string;
  onClose: () => void;
  onJoined: (s: SocialSession) => void;
}

export function JoinModal({ session, venueName, onClose, onJoined }: Props) {
  const { user } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    setQty(1); setErrors({});
    setName(user?.fullName ?? ''); setPhone(user?.phone ?? '');
  }, [session, user]);

  if (!session) return null;
  const left = session.capacity - session.taken;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Vui lòng nhập tên của bạn';
    if (!isValidPhone(phone)) errs.phone = 'Số điện thoại không hợp lệ';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const s = await api.joinSocial(session.id, { name, phone, quantity: qty });
      toast.show(`Đã đặt ${qty} vé thành công`);
      onJoined(s);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.errors);
      toast.show((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Đặt chỗ Social" className="max-w-[520px]">
      <form onSubmit={submit} noValidate className="space-y-4 p-5">
        <div className="rounded-lg bg-primary-soft p-3 text-sm text-ink">
          <p className="font-bold">{venueName}</p>
          <p className="mt-1">{session.title} · {session.level} · {session.court}</p>
          <p className="mt-1">{ddmmyyyy(session.date)} · {session.startTime} - {session.endTime} · còn {left} chỗ</p>
        </div>
        <div>
          <label htmlFor="join-name" className="mb-1.5 block text-sm font-bold text-primary-deep">Tên của bạn</label>
          <TextInput id="join-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên của bạn" aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="join-phone" className="mb-1.5 block text-sm font-bold text-primary-deep">Số điện thoại</label>
          <PhoneInput id="join-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại" aria-invalid={!!errors.phone} />
          {errors.phone && <p className="mt-1 text-sm text-danger">{errors.phone}</p>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary-deep">Số vé</span>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Giảm số vé" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary"><Icon name="minus" size={16} /></button>
            <span className="w-6 text-center text-lg font-bold" aria-live="polite">{qty}</span>
            <button type="button" aria-label="Tăng số vé" onClick={() => setQty((q) => Math.min(Math.min(4, left), q + 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary"><Icon name="plus" size={16} /></button>
          </div>
        </div>
        <p className="flex justify-between border-t border-line pt-3 text-[15px]"><span>Tổng tiền</span><b className="text-[#f08c00]">{formatVnd(session.price * qty)}</b></p>
        <Button type="submit" variant="accent" loading={loading} className="h-11 w-full">XÁC NHẬN ĐẶT CHỖ</Button>
      </form>
    </Modal>
  );
}
