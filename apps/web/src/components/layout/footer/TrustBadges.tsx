import { useEffect, useRef, useState } from "react";

/**
 * TrustBadges — Client-only rendered trust seal container.
 * Uses deferred mount pattern to prevent SSR hydration mismatch
 * with third-party badge scripts/images.
 *
 * Includes: Enamad, Samandehi, Torob, Zarinpal
 */
export default function TrustBadges() {
  const [mounted, setMounted] = useState(false);
  const zarinpalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Inject Zarinpal trust script after mount */
  useEffect(() => {
    if (!(mounted && zarinpalRef.current)) return;

    const script = document.createElement("script");
    script.src = "https://www.zarinpal.com/webservice/TrustCode";
    script.type = "text/javascript";
    script.async = true;
    zarinpalRef.current.appendChild(script);

    return () => {
      if (zarinpalRef.current && script.parentNode === zarinpalRef.current) {
        zarinpalRef.current.removeChild(script);
      }
    };
  }, [mounted]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Enamad Badge */}
      {mounted && (
        <a
          referrerPolicy="origin"
          target="_blank"
          rel="noopener noreferrer"
          href="https://trustseal.enamad.ir/?id=443429&Code=hAdmEU9PW0oJNf2sLFPph9sQdnpTK8lb"
          className="group flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl border border-border-light bg-surface-secondary p-2.5 transition-all duration-300 ease-in-out hover:border-accent hover:shadow-md"
        >
          <img
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=443429&code=hAdmEU9PW0oJNf2sLFPph9sQdnpTK8lb"
            alt="اینماد رایان تک"
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ aspectRatio: "1 / 1" }}
          />
        </a>
      )}

      {/* Samandehi Badge */}
      <div className="group flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl border border-border-light bg-surface-secondary p-2.5 transition-all duration-300 ease-in-out hover:border-accent hover:shadow-md">
        <img
          src="/icons/samandehi.svg"
          alt="ساماندهی"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: "1 / 1" }}
        />
      </div>

      {/* Torob Badge */}
      <a
        href="https://torob.com/shop/95028/%D8%B1%D8%A7%DB%8C%D8%A7%D9%86-%D8%AA%D9%90%DA%A9-%DB%8C%D8%B2%D8%AF/%D9%85%D8%AD%D8%B5%D9%88%D9%84%D8%A7%D8%AA/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl border border-border-light bg-surface-secondary p-2.5 transition-all duration-300 ease-in-out hover:border-accent hover:shadow-md"
      >
        <img
          src="/icons/torob.svg"
          alt="فروشگاه رایان تک در ترب"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: "1 / 1" }}
        />
      </a>

      {/* Zarinpal Trust Seal — script injected client-side */}
      {mounted && (
        <div
          ref={zarinpalRef}
          className="flex h-[72px] min-w-[72px] items-center justify-center overflow-hidden rounded-2xl border border-border-light bg-surface-secondary p-2.5 transition-all duration-300 ease-in-out hover:border-accent hover:shadow-md"
        />
      )}
    </div>
  );
}
