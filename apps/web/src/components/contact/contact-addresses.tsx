import { motion } from "framer-motion";
import { ClockIcon, MapPinIcon, PhoneIcon } from "lucide-react";

interface BranchDetails {
  id: number;
  name: string;
  address: string;
  hours: string;
  staff: { name: string; phone: string }[];
}

const BRANCHES: BranchDetails[] = [
  {
    id: 1,
    name: "شعبه جوان (مرکزی)",
    address: "یزد، میدان عالم به سمت میدان دانش‌آموز، بعد از پل عابر پیاده، فروشگاه رایان تک",
    hours: "شنبه تا پنج‌شنبه — ۹ صبح تا ۲ ظهر و ۵ عصر تا ۱۰ شب",
    staff: [
      { name: "احسان رضایی", phone: "09134300916" },
      { name: "عرفان هاتفی", phone: "09134300926" },
    ],
  },
  {
    id: 2,
    name: "شعبه دهه فجر",
    address: "یزد، میدان یعقوبی به سمت صاحب الزمان، جنب پل عابر پیاده، فروشگاه رایان تک",
    hours: "شنبه تا پنج‌شنبه — ۹ صبح تا ۲ ظهر و ۵ عصر تا ۱۰ شب",
    staff: [
      { name: "محسن رضایی", phone: "09134388606" },
      { name: "رسام کریمی", phone: "09134388636" },
    ],
  },
];

export function ContactAddresses() {
  return (
    <section className="w-full py-6">
      <h3 className="text-base font-semibold text-text-primary mb-5 border-s-4 border-accent ps-3">
        نشانی شعب فیزیکی رایان تک
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRANCHES.map((branch) => (
          <motion.div
            key={branch.id}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden"
          >
            {/* Ambient Background Graphic */}
            <div className="absolute -inset-e-8 -top-8 w-24 h-24 bg-accent/5 rounded-full blur-xl pointer-events-none -z-10" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light text-accent">
                  <MapPinIcon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-text-primary">{branch.name}</h4>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-4">{branch.address}</p>

              <div className="flex items-start gap-2 text-xs text-text-muted mb-6">
                <ClockIcon className="h-4 w-4 shrink-0 text-accent" />
                <span>ساعات کاری: {branch.hours}</span>
              </div>
            </div>

            {/* Direct branch contacts list */}
            <div className="border-t border-border-light pt-4 space-y-2.5">
              <span className="text-[10px] text-text-muted font-bold block mb-1">
                تلفن تماس مستقیم شعبه:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branch.staff.map((person) => (
                  <a
                    key={person.phone}
                    href={`tel:${person.phone}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-secondary/40 border border-border-light hover:border-accent/40 hover:bg-surface-secondary transition-all text-xs"
                    dir="ltr"
                  >
                    <span className="text-text-primary font-medium tracking-wide flex items-center gap-1.5">
                      <PhoneIcon className="h-3.5 w-3.5 text-accent" />
                      {person.phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")}
                    </span>
                    <span className="text-text-secondary font-semibold" dir="rtl">
                      {person.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
