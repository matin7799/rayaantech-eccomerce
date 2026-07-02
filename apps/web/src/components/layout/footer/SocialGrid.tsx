import { motion } from "framer-motion";

/* ─── Social Link Types ─── */

interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: string;
  bgColor: string;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: "instagram",
    label: "اینستاگرام",
    href: "https://instagram.com/rayaantech.ir",
    icon: "/icons/instagram.svg",
    bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  },
  {
    id: "telegram",
    label: "تلگرام",
    href: "https://t.me/rayaantech_yazd",
    icon: "/icons/telegram.svg",
    bgColor: "bg-[#2AABEE]",
  },
  {
    id: "eitaa",
    label: "ایتا",
    href: "https://eitaa.com/rayaantech_yazd",
    icon: "/icons/eitaa.svg",
    bgColor: "bg-[#F7A731]",
  },
  {
    id: "bale",
    label: "بله",
    href: "https://ble.ir/rayaantech_yazd",
    icon: "/icons/bale.svg",
    bgColor: "bg-[#4CAF50]",
  },
  {
    id: "rubika",
    label: "روبیکا",
    href: "https://rubika.ir/rayaantech_yazd",
    icon: "/icons/rubika.svg",
    bgColor: "bg-[#2D2D2D]",
  },
];

export default function SocialGrid() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-text-muted">با ما همراه باشید:</span>
      <div className="flex items-center gap-2">
        {SOCIAL_LINKS.map((link) => (
          <motion.a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${link.bgColor} shadow-sm transition-shadow duration-200 hover:shadow-md`}
            aria-label={link.label}
            title={link.label}
          >
            <span className="sr-only">{link.label}</span>
            <img
              src={link.icon}
              alt=""
              className="h-4.5 w-4.5"
              style={{ aspectRatio: "1 / 1" }}
              aria-hidden="true"
            />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
