import { motion } from "framer-motion";
import { PhoneCallIcon } from "lucide-react";

interface TeamContact {
  id: number;
  name: string;
  role: string;
  phone: string;
  department: string;
  initials: string;
  gradient: string;
}

const TEAM_CONTACTS: TeamContact[] = [
  {
    id: 1,
    name: "علیرضا حاتمی",
    role: "مدیر عامل و بنیان‌گذار",
    department: "مدیریت",
    phone: "09131512790",
    initials: "عه",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: 2,
    name: "صادق تقوی",
    role: "سرپرست پشتیبانی فنی و سرویس سخت‌افزار",
    department: "پشتیبانی فنی",
    phone: "09352555519",
    initials: "صت",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    name: "احسان رضایی",
    role: "کارشناس ارشد فروش و مشاوره حضوری",
    department: "شعبه جوان (مرکزی)",
    phone: "09134300916",
    initials: "ار",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    name: "عرفان هاتفی",
    role: "کارشناس فروش لپ‌تاپ و کنسول",
    department: "شعبه جوان (مرکزی)",
    phone: "09134300926",
    initials: "عه",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: 5,
    name: "محسن رضایی",
    role: "کارشناس ارشد فروش و تحویل سفارشات",
    department: "شعبه دهه فجر",
    phone: "09134388606",
    initials: "مر",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: 6,
    name: "رسام کریمی",
    role: "کارشناس تحویل و تست درگاه‌های سخت‌افزار",
    department: "شعبه دهه فجر",
    phone: "09134388636",
    initials: "رک",
    gradient: "from-rose-500 to-pink-600",
  },
];

export function ContactTeam() {
  return (
    <section className="w-full py-6">
      <h3 className="text-base font-semibold text-text-primary mb-5 border-s-4 border-accent ps-3">
        تیم ارتباطی و پرسنل پاسخگو
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEAM_CONTACTS.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between items-center text-center shadow-sm"
          >
            <div className="flex flex-col items-center w-full">
              {/* Luxury Initials Circle Avatar */}
              <div
                className={`h-16 w-16 rounded-full bg-linear-to-tr ${member.gradient} flex items-center justify-center text-white text-base font-bold border-2 border-surface shadow-sm mb-3 select-none`}
              >
                {member.initials}
              </div>

              <span className="text-[10px] text-text-muted bg-surface-secondary px-2 py-0.5 rounded-md font-semibold mb-2">
                {member.department}
              </span>

              <h4 className="text-sm font-bold text-text-primary mb-1">{member.name}</h4>

              <p className="text-xs text-text-secondary leading-relaxed mb-5 min-h-container-padding flex items-center justify-center">
                {member.role}
              </p>
            </div>

            {/* Direct Dial button card action */}
            <a
              href={`tel:${member.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-light text-accent hover:bg-accent hover:text-white transition-all text-xs font-semibold"
              dir="ltr"
            >
              <PhoneCallIcon className="h-3.5 w-3.5" />
              <span>{member.phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")}</span>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
