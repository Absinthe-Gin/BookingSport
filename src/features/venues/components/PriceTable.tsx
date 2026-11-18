import type { PriceRow } from '@shared/types';
import { formatVnd } from '@shared/schedule';

export function PriceTable({ title, rows, tone = 'light' }: { title: string; rows: PriceRow[]; tone?: 'light' | 'onGreen' }) {
  const head = tone === 'onGreen' ? 'text-white' : 'text-ink';
  return (
    <div>
      <p className={`mb-2 text-center text-[15px] font-semibold ${head}`}>Sân</p>
      <table className="w-full border-collapse bg-white text-center text-[15px] text-primary-deep">
        <thead>
          <tr><th colSpan={3} className="border border-[#3d7a5a] py-2.5 font-bold">{title}</th></tr>
          <tr>
            <th className="w-1/3 border border-[#3d7a5a] py-2.5 font-bold">Khung giờ</th>
            <th className="w-1/3 border border-[#3d7a5a] py-2.5 font-bold">Cố định</th>
            <th className="w-1/3 border border-[#3d7a5a] py-2.5 font-bold">Vãng lai</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.fromHour}>
              <td className="border border-[#3d7a5a] py-2.5">{r.fromHour}h - {r.toHour}h</td>
              <td className="border border-[#3d7a5a] py-2.5">{formatVnd(r.fixed)}</td>
              <td className="border border-[#3d7a5a] py-2.5">{formatVnd(r.walkIn)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
