import { Link } from "@tanstack/react-router";
import { Headset, MapPin, Phone, Share2, UserRound } from "lucide-react";
import { BRANCHES, DEPARTMENTS, FOOTER_LINKS, SOCIAL_CHANNELS } from "./footer-data";
import SocialGrid from "./SocialGrid";
import TrustBadges from "./TrustBadges";

/* ─── Sub-Components ─── */

function DeptIcon({ type }: { type: "support" | "management" }) {
  if (type === "support") {
    return <Headset className="h-4 w-4 text-accent" aria-hidden="true" />;
  }
  return <UserRound className="h-4 w-4 text-accent" aria-hidden="true" />;
}

/* ─── Main Component ─── */

export default function FooterShell() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 px-5 border-t border-border bg-surface transition-colors duration-300 ease-in-out">
      <div className="mx-auto max-w-page-max px-[--spacing-container-padding] py-12">
        {/* ═══ Main Footer Grid ═══ */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(260px,1fr)_3fr]">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 no-underline"
              aria-label="صفحه اصلی رایان تک"
            >
              <img
                src="/images/logo-dark.svg"
                alt="رایان تک"
                className="block h-12 w-auto dark:hidden"
              />
              <img
                src="/images/logo-light.svg"
                alt="رایان تک"
                className="hidden h-12 w-auto dark:block"
              />
            </Link>
            <p className="max-w-xs text-xs sm:text-sm font-normal leading-7 text-text-secondary">
              واردات مستقیم لپ‌تاپ، موبایل، کنسول بازی، آل‌این‌وان و پرینتر با تضمین اصالت و بهترین
              قیمت. ارائه شرایط اقساط ویژه با کمترین کارمزد در شعب فعال یزد و ارسال سریع به سراسر
              کشور.
            </p>
          </div>

          {/* Columns 2-4 Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {/* Column 2: Physical Branches */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary border-s-2 border-accent ps-2">
                شعب حضوری رایان تک
              </h4>
              <div className="space-y-4">
                {BRANCHES.map((branch) => (
                  <div
                    key={branch.id}
                    className="group rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="text-xs font-semibold text-text-primary">
                        {branch.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                      {branch.address}
                    </p>
                    <div className="space-y-2 border-t border-border-light pt-2">
                      {branch.staff.map((person) => (
                        <a
                          key={person.phone}
                          href={`tel:${person.phone.replace(/\s/g, "")}`}
                          className="flex items-center justify-between text-xs hover:text-accent"
                          dir="ltr"
                        >
                          <span className="text-text-secondary flex items-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            {person.phone}
                          </span>
                          <span className="text-[10px] text-text-muted" dir="rtl">
                            {person.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Departments */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary border-s-2 border-accent ps-2">
                پشتیبانی و مدیریت
              </h4>
              <div className="space-y-4">
                {DEPARTMENTS.map((dept) => (
                  <div
                    key={dept.id}
                    className="group rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <DeptIcon type={dept.icon} />
                      <span className="text-xs font-semibold text-text-primary">{dept.title}</span>
                    </div>
                    <div className="space-y-2">
                      {dept.staff.map((person) => (
                        <a
                          key={person.phone}
                          href={`tel:${person.phone.replace(/\s/g, "")}`}
                          className="flex items-center justify-between text-xs hover:text-accent"
                          dir="ltr"
                        >
                          <span className="text-text-secondary flex items-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            {person.phone}
                          </span>
                          <span className="text-[10px] text-text-muted" dir="rtl">
                            {person.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Elevated Social Channels (New refined primary footer section) */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary border-s-2 border-accent ps-2">
                شبکه‌های اجتماعی و کانال‌ها
              </h4>
              <div className="flex flex-col gap-2.5">
                {SOCIAL_CHANNELS.map((channel) => (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-xl border border-border bg-surface transition-all duration-300 hover:shadow-sm text-xs font-medium ${channel.color}`}
                  >
                    <span className="flex items-center gap-2.5 text-text-primary">
                      <img src={channel.icon} className="h-4.5 w-4.5" alt="" />
                      <span>{channel.label}</span>
                    </span>
                    <Share2 className="h-3.5 w-3.5 text-text-muted hover:text-accent transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Trust Badges Section ═══ */}
        <div className="mt-10 border-t border-border-light pt-8">
          <TrustBadges />
        </div>

        {/* ═══ Bottom Bar: Legal + Social + Copyright ═══ */}
        <div className="mt-8 flex flex-col gap-5 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Footer Navigation Links */}
            <nav
              className="flex flex-wrap items-center gap-3 sm:gap-5 justify-center"
              aria-label="لینک‌های مفید و قانونی"
            >
              {FOOTER_LINKS.map((link, idx) => (
                <span key={link.href} className="flex items-center gap-3 sm:gap-5">
                  <Link
                    to={link.href}
                    className="text-xs font-medium text-text-muted no-underline transition-colors duration-300 ease-in-out hover:text-accent"
                  >
                    {link.label}
                  </Link>
                  {idx < FOOTER_LINKS.length - 1 && (
                    <span className="h-3 w-px bg-border-light" aria-hidden="true" />
                  )}
                </span>
              ))}
            </nav>

            {/* Compact Social Grid at Copyright Row */}
            <SocialGrid />
          </div>

          {/* Copyright */}
          <p className="text-center text-xs font-normal text-text-muted">
            تمامی حقوق این سایت متعلق به مجموعه{" "}
            <Link
              to="/"
              className="font-medium text-text-primary no-underline transition-colors duration-300 hover:text-accent"
            >
              رایان تک
            </Link>{" "}
            می‌باشد. &copy; {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
