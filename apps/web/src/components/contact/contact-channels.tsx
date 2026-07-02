import { motion } from "framer-motion";
import {
  InstagramIcon,
  MailIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  SendIcon,
} from "lucide-react";

interface SocialChannel {
  id: number;
  label: string;
  handle: string;
  href: string;
  icon: React.ReactNode;
  colorClass: string;
}

const CHANNELS: SocialChannel[] = [
  {
    id: 1,
    label: "کانال تلگرام رسمی",
    handle: "@rayaantech_yazd",
    href: "https://t.me/rayaantech_yazd",
    icon: <SendIcon className="h-5 w-5" />,
    colorClass: "text-[#2AABEE] bg-[#2AABEE]/10",
  },
  {
    id: 2,
    label: "صفحه اینستاگرام",
    handle: "@rayaantech.ir",
    href: "https://instagram.com/rayaantech.ir",
    icon: <InstagramIcon className="h-5 w-5" />,
    colorClass: "text-pink-500 bg-pink-500/10",
  },
  {
    id: 3,
    label: "پیام‌رسان ایتا",
    handle: "@rayaantech_yazd",
    href: "https://eitaa.com/rayaantech_yazd",
    icon: <MessageSquareIcon className="h-5 w-5" />,
    colorClass: "text-[#F7A731] bg-[#F7A731]/10",
  },
  {
    id: 4,
    label: "پیام‌رسان بله",
    handle: "@rayaantech_yazd",
    href: "https://ble.ir/rayaantech_yazd",
    icon: <MessageCircleIcon className="h-5 w-5" />,
    colorClass: "text-[#4CAF50] bg-[#4CAF50]/10",
  },
  {
    id: 5,
    label: "کانال روبیکا",
    handle: "@rayaantech_yazd",
    href: "https://rubika.ir/rayaantech_yazd",
    icon: <SendIcon className="h-5 w-5 -rotate-45" />,
    colorClass: "text-violet-400 bg-violet-500/10",
  },
  {
    id: 6,
    label: "پست الکترونیک (ایمیل)",
    handle: "info@rayantech.ir",
    href: "mailto:info@rayantech.ir",
    icon: <MailIcon className="h-5 w-5" />,
    colorClass: "text-indigo-400 bg-indigo-500/10",
  },
];

export function ContactChannels() {
  return (
    <section className="w-full py-6">
      <h3 className="text-base font-semibold text-text-primary mb-5 border-s-4 border-accent ps-3">
        راه‌های ارتباطی و شبکه‌های اجتماعی
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CHANNELS.map((channel) => (
          <motion.a
            key={channel.id}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -3 }}
            className="flex flex-col items-center justify-between p-5 rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-accent hover:shadow-md text-center h-full"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${channel.colorClass} mb-4`}
            >
              {channel.icon}
            </div>

            <div className="flex-1">
              <span className="text-xs text-text-muted font-medium block mb-1">
                {channel.label}
              </span>
              <span className="text-sm font-bold text-text-primary" dir="ltr">
                {channel.handle}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
