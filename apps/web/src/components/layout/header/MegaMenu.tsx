import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { type CategoryNode, useMegaMenuData } from "./useMegaMenuData";

const MEGA_SPRING = { type: "spring" as const, stiffness: 280, damping: 22 };
const CONTENT_SPRING = { type: "spring" as const, stiffness: 350, damping: 30 };

interface MegaMenuProps {
  onClose: () => void;
}

/**
 * MegaMenu — Dynamic category navigation fetched via tRPC.
 * Categories are cached with 24h staleTime for instant hydration.
 */
export function MegaMenu({ onClose }: MegaMenuProps) {
  const { categories, isLoading } = useMegaMenuData();
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeCategory = categories[activeIndex] ?? null;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCategoryHover = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={MEGA_SPRING}
        className="flex h-48 w-[60vw] items-center justify-center rounded-2xl border border-border-light bg-surface/95 shadow-2xl backdrop-blur-xl"
      >
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </motion.div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={MEGA_SPRING}
      className="w-full max-w-page-max overflow-hidden rounded-2xl border border-border-light bg-surface/95 shadow-2xl backdrop-blur-xl transition-colors duration-300"
      dir="rtl"
      role="menu"
      aria-label="دسته‌بندی محصولات"
    >
      {/* Decorative gradient line */}
      <div className="h-px w-full bg-linear-to-l from-transparent via-accent to-transparent opacity-50" />

      <div className="mx-auto flex w-full max-w-page-max px-8 py-5">
        {/* Right Panel — Root Categories */}
        <nav
          className="flex w-52 shrink-0 flex-col gap-0.5 border-e border-border-light pe-4"
          aria-label="دسته‌بندی‌های اصلی"
        >
          {categories.map((cat, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={cat.id}
                type="button"
                onMouseEnter={() => handleCategoryHover(idx)}
                onFocus={() => handleCategoryHover(idx)}
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-surface-action text-accent shadow-sm"
                    : "text-text-secondary hover:text-text-primary",
                )}
                role="menuitem"
                aria-current={isActive ? "true" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="mega-cat-indicator"
                    className="absolute inset-e-0 top-2 bottom-2 w-[3px] rounded-full bg-accent"
                    transition={CONTENT_SPRING}
                  />
                )}
                <span>{cat.name}</span>
                {isActive && (
                  <ChevronLeft
                    className="ms-auto h-3.5 w-3.5 text-accent rtl:rotate-180"
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            );
          })}

          {/* View all */}
          <div className="mt-3 border-t border-border-light pt-3">
            <Link
              to="/products"
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-accent no-underline transition-colors hover:bg-surface-action"
            >
              مشاهده همه محصولات
              <ChevronLeft className="h-3 w-3 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </nav>

        {/* Left Panel — Subcategories */}
        <div className="flex flex-1 flex-col ps-5">
          {activeCategory && (
            <>
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-sm font-semibold text-text-primary">{activeCategory.name}</h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={CONTENT_SPRING}
                >
                  {activeCategory.children.length > 0 ? (
                    <SubcategoryGrid children={activeCategory.children} onClose={onClose} />
                  ) : (
                    <p className="text-sm text-text-muted">زیرمجموعه‌ای تعریف نشده است</p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer link */}
              <div className="mt-4 border-t border-border-light pt-3">
                <Link
                  to={`/products?category=${activeCategory.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-accent no-underline transition-colors duration-200 hover:bg-surface-action"
                >
                  مشاهده همه {activeCategory.name}
                  <ChevronLeft className="h-3 w-3 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Subcategory Grid Sub-Component ──────────────────────────────────────────

interface SubcategoryGridProps {
  children: CategoryNode[];
  onClose: () => void;
}

function SubcategoryGrid({ children, onClose }: SubcategoryGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-1" role="list">
      {children.map((sub) => (
        <li key={sub.id}>
          <Link
            to={`/products?category=${sub.slug}`}
            onClick={onClose}
            className="group flex items-center gap-2 rounded-lg px-3 py-2.5 no-underline transition-all duration-200 hover:bg-surface-action"
            role="menuitem"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-border transition-colors duration-200 group-hover:bg-accent" />
            <span className="text-sm font-medium text-text-secondary transition-colors duration-200 group-hover:text-accent">
              {sub.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
