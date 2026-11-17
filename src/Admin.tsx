import React, { useEffect, useState } from 'react';
import { Link2, Copy, Check, MessageSquareText } from 'lucide-react';
import { GUEST_PREFIXES, GuestPrefixKey, buildGuestUrl, guestDisplayName } from './guestLink';
import { INVITATION } from './invitation';

const GREETING_WORD = 'ආදරණීය';

const buildMessage = (displayName: string, url: string) =>
  `${GREETING_WORD} ${displayName} ❤️

අප දෙදෙනාගේ නව ජීවන ගමන ආරම්භ කරන, අපේ ජීවිතයේ වඩාත්ම සුවිශේෂී දිනය සමරන්නට ඔබට හදපිරි සතුටින් ආරාධනා කරමු. 💍🤍

අපගේ විවාහ ආරාධනා පත්‍රය සහ උත්සවයේ සියලු විස්තර පහත සබැඳිය ඔස්සේ නරඹන්න 🌐:

${url}

ඔබගේ පැමිණීම අපට ඉමහත් සතුටක් වන අතර, මේ සුන්දර මොහොත ඔබ සමඟ සැමරීමට ලැබීම අපට මහත් ගෞරවයකි.

ආදරයෙන්,
❤️ ${INVITATION.couple.groom} සහ ${INVITATION.couple.bride}`;

type Generated = { url: string; message: string; greeting: string; inviteLine: string };

export default function Admin() {
  const [prefix, setPrefix] = useState<GuestPrefixKey>('mr');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = guestName.replace(/\s+/g, ' ').trim();
    if (!name) return;

    const displayName = guestDisplayName(name, prefix);
    const url = buildGuestUrl(window.location.origin, name, prefix);
    setGenerated({
      url,
      message: buildMessage(displayName, url),
      greeting: `${GREETING_WORD} ${displayName} ❤️`,
      inviteLine: `අතිනත ගැනීමේ ප්‍රීතිය නිමිත්තෙන් ${GREETING_WORD} ${displayName} කෙරෙන සුහද ඇරයුමයි මේ.`,
    });
  };

  const handleCopy = async (kind: 'link' | 'message') => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(kind === 'link' ? generated.url : generated.message);
      setToast(kind === 'link' ? 'Link copied!' : 'Message copied!');
    } catch (err) {
      console.error('Failed to copy', err);
      setToast('Copy failed. Please copy it manually.');
    }
  };

  const fieldClass =
    'w-full rounded-[10px] border border-[#b98a2f]/45 bg-[#fcf8ee] px-4 py-3 text-[#5a4a33] placeholder:text-[#b9a888] focus:border-[#8c6420] focus:outline-none focus:ring-1 focus:ring-[#b98a2f]/40 transition-colors';
  const labelClass = 'text-[0.9rem] font-semibold text-[#8c6420]';
  const sectionLabel = 'text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6420]/80';
  const disabledClass = 'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-transparent';

  return (
    <div
      className="h-[100dvh] overflow-y-auto px-4 py-12"
      style={{ background: 'rgba(237, 223, 184, 0.4)', fontFamily: "'Montserrat', Arial, sans-serif" }}
    >
      <div className="mx-auto max-w-xl rounded-[28px] bg-gradient-to-b from-[#e7cf8c] via-[#b98a2f] to-[#8c6420] p-[1.5px] shadow-[0_40px_80px_-40px_rgba(120,86,30,0.6)]">
        <div className="rounded-[26.5px] bg-[#fcf8ee] p-6 md:p-10">
          <h1 className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.34em] text-[#8c6420]">
            <Link2 className="h-5 w-5 text-[#b98a2f]" />
            Invitation Links
          </h1>
          <p className="mb-8 text-center text-sm text-[#8a7a60]">
            {INVITATION.couple.groom} & {INVITATION.couple.bride}
          </p>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prefix" className={labelClass}>
                Select Prefix
              </label>
              <select
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as GuestPrefixKey)}
                className={fieldClass}
              >
                {GUEST_PREFIXES.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="guest-name" className={labelClass}>
                Guest Name
              </label>
              <input
                id="guest-name"
                type="text"
                placeholder="e.g. Sanjaya"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={fieldClass}
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-[#b98a2f] to-[#8c6420] py-4 text-[1.02rem] font-bold text-[#fdf8ec] shadow-[0_14px_30px_-12px_rgba(120,86,30,0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <MessageSquareText className="h-4 w-4" />
              Generate Link
            </button>
          </form>

          {generated && (
            <div className="mt-8 space-y-5">
              <div className="space-y-1.5">
                <p className={sectionLabel}>Invitation link</p>
                <a
                  href={generated.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all rounded-xl border border-[#b98a2f]/35 bg-white/70 px-4 py-3 text-[0.95rem] font-semibold text-[#8c6420] underline-offset-4 hover:underline"
                >
                  {generated.url}
                </a>
              </div>

              <div className="space-y-1.5">
                <p className={sectionLabel}>Shown on the invitation</p>
                <p className="rounded-xl border border-[#b98a2f]/35 bg-white/70 px-4 py-3 text-[0.95rem] italic text-[#5a4a33]">
                  {generated.inviteLine}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className={sectionLabel}>WhatsApp message</p>
                <pre
                  className="whitespace-pre-wrap break-words rounded-2xl border border-[#b98a2f]/35 bg-white/70 p-5 text-[0.92rem] leading-[1.75] text-[#5a4a33]"
                  style={{ fontFamily: 'inherit' }}
                >
                  <strong className="text-[#8c6420]">{generated.greeting}</strong>
                  {generated.message.slice(generated.greeting.length)}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!generated}
              onClick={() => handleCopy('link')}
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#b98a2f]/50 px-5 py-3 font-semibold text-[#8c6420] transition-colors hover:bg-[#b98a2f]/10 ${disabledClass}`}
            >
              <Copy className="h-4 w-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => handleCopy('message')}
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#b98a2f] to-[#8c6420] px-5 py-3 font-semibold text-[#fdf8ec] shadow-[0_10px_20px_-12px_rgba(120,86,30,0.7)] transition-transform hover:-translate-y-0.5 ${disabledClass}`}
            >
              <Copy className="h-4 w-4" />
              Copy Full Message
            </button>
          </div>
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-8 flex justify-center px-4 transition-all duration-300 ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {toast && (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#5a4a33] px-5 py-2.5 text-sm font-semibold text-[#fdf8ec] shadow-lg">
            <Check className="h-4 w-4" />
            {toast}
          </span>
        )}
      </div>
    </div>
  );
}
