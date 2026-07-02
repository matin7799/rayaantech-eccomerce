export interface StaffContact {
  name: string;
  phone: string;
}

export interface Branch {
  id: string;
  title: string;
  address: string;
  staff: readonly StaffContact[];
}

export interface Department {
  id: string;
  title: string;
  icon: "support" | "management";
  staff: readonly StaffContact[];
}

export interface FooterSocial {
  id: string;
  label: string;
  href: string;
  icon: string;
  color: string;
}

export const BRANCHES: readonly Branch[] = [
  {
    id: "javan",
    title: "شعبه جوان",
    address: "یزد، میدان عالم به سمت میدان دانش‌آموز، بعد از پل عابر پیاده",
    staff: [
      { name: "احسان رضایی", phone: "0913 430 0916" },
      { name: "عرفان هاتفی", phone: "0913 430 0926" },
    ],
  },
  {
    id: "dahefajr",
    title: "شعبه دهه فجر",
    address: "یزد، میدان یعقوبی به سمت صاحب الزمان، جنب پل عابر پیاده",
    staff: [
      { name: "محسن رضایی", phone: "0913 438 8606" },
      { name: "رسام کریمی", phone: "0913 438 8636" },
    ],
  },
];

export const DEPARTMENTS: readonly Department[] = [
  {
    id: "support",
    title: "پشتیبانی فنی",
    icon: "support",
    staff: [{ name: "صادق تقوی", phone: "0935 255 5519" }],
  },
  {
    id: "management",
    title: "مدیریت",
    icon: "management",
    staff: [{ name: "علیرضا حاتمی", phone: "0913 151 2790" }],
  },
];

export const SOCIAL_CHANNELS: readonly FooterSocial[] = [
  {
    id: "telegram",
    label: "کانال تلگرام رسمی",
    href: "https://t.me/rayaantech_yazd",
    icon: "/icons/telegram.svg",
    color: "hover:text-[#2AABEE] hover:border-[#2AABEE]/30",
  },
  {
    id: "instagram",
    label: "صفحه اینستاگرام",
    href: "https://instagram.com/rayaantech.ir",
    icon: "/icons/instagram.svg",
    color: "hover:text-pink-500 hover:border-pink-500/30",
  },
  {
    id: "eitaa",
    label: "پیام‌رسان ایتا",
    href: "https://eitaa.com/rayaantech_yazd",
    icon: "/icons/eitaa.svg",
    color: "hover:text-[#F7A731] hover:border-[#F7A731]/30",
  },
  {
    id: "bale",
    label: "پیام‌رسان بله",
    href: "https://ble.ir/rayaantech_yazd",
    icon: "/icons/bale.svg",
    color: "hover:text-[#4CAF50] hover:border-[#4CAF50]/30",
  },
  {
    id: "rubika",
    label: "کانال روبیکا",
    href: "https://rubika.ir/rayaantech_yazd",
    icon: "/icons/rubika.svg",
    color: "hover:text-violet-500 hover:border-violet-500/30",
  },
];

export const FOOTER_LINKS = [
  { label: "درباره ما", href: "/about" },
  { label: "ارتباط با ما", href: "/social-info" },
  { label: "خرید اقساطی", href: "/installments" },
  { label: "قوانین و مقررات", href: "/terms" },
  { label: "حریم خصوصی", href: "/privacy" },
];
