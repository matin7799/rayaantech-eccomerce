import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon, MailIcon } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  initials: string;
  gradient: string;
  links: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "علیرضا حاتمی",
    role: "بنیان‌گذار و مدیرعامل رایان تک",
    bio: "راهبر ارشد تجاری و واردات مستقیم سخت‌افزار از سال ۱۳۹۸، با هدف ارائه بی‌واسطه تجهیزات باکیفیت.",
    initials: "عه",
    gradient: "from-indigo-500 to-purple-600",
    links: {
      linkedin: "https://linkedin.com",
      email: "management@rayantech.ir",
    },
  },
  {
    id: 2,
    name: "صادق تقوی",
    role: "مدیر پشتیبانی فنی و ممیزی سخت‌افزار",
    bio: "سرپرست تیم تست ۷ مرحله‌ای کیفی و تضمین‌کننده سلامت قطعات ورودی به آزمایشگاه فنی رایان تک.",
    initials: "صت",
    gradient: "from-blue-500 to-indigo-600",
    links: {
      linkedin: "https://linkedin.com",
      email: "support@rayantech.ir",
    },
  },
  {
    id: 3,
    name: "احسان رضایی",
    role: "مدیر و ناظر فنی شعبه جوان",
    bio: "مسئول هماهنگی کارشناسی قطعات و تحویل حضوری کالاها در شعبه مرکزی (جوان).",
    initials: "ار",
    gradient: "from-emerald-500 to-teal-600",
    links: {
      linkedin: "https://linkedin.com",
      email: "javan@rayantech.ir",
    },
  },
  {
    id: 4,
    name: "محسن رضایی",
    role: "مدیر و ناظر فنی شعبه دهه فجر",
    bio: "مسئول تضمین کیفیت، بسته‌بندی پلمپ و هماهنگی توزیع کالاها در شعبه دهه فجر.",
    initials: "مر",
    gradient: "from-amber-500 to-orange-600",
    links: {
      linkedin: "https://linkedin.com",
      email: "dahefajr@rayantech.ir",
    },
  },
];

export function TeamLedger() {
  return (
    <section className="w-full py-12 px-1">
      <div className="text-center mb-12">
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-accent uppercase mb-2 block">
          رهبری و سرمایه انسانی
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">تیم مدیریتی رایان تک</h2>
        <p className="mt-3 text-sm text-text-secondary max-w-2xl mx-auto">
          متخصصین و مهندسینی که فرآیند واردات، ارزیابی کیفی، بهسازی و گارانتی سخت‌افزار را در شعب
          فعال مدیریت می‌کنند.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {TEAM_MEMBERS.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-surface border border-border rounded-2xl p-6 text-center flex flex-col justify-between items-center shadow-sm"
          >
            <div className="flex flex-col items-center">
              {/* Luxury Avatar Circle with Initials and Vibrant Gradient Background */}
              <div
                className={`h-20 w-20 rounded-full bg-gradient-to-tr ${member.gradient} flex items-center justify-center text-white text-xl font-bold border-4 border-surface shadow-md mb-4 select-none`}
              >
                {member.initials}
              </div>

              <h3 className="text-sm font-bold text-text-primary mb-1">{member.name}</h3>

              <span className="text-xs font-semibold text-accent mb-3 block">{member.role}</span>

              <p className="text-xs text-text-secondary leading-relaxed mb-6 max-w-[220px]">
                {member.bio}
              </p>
            </div>

            {/* Social Contact Links */}
            <div className="flex items-center gap-3.5 border-t border-border-light pt-4 w-full justify-center">
              {member.links.linkedin && (
                <a
                  href={member.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-accent transition-colors"
                  title="لینکدین"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
              {member.links.github && (
                <a
                  href={member.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-accent transition-colors"
                  title="گیت‌هاب"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {member.links.email && (
                <a
                  href={`mailto:${member.links.email}`}
                  className="text-text-muted hover:text-accent transition-colors"
                  title="ایمیل"
                >
                  <MailIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
