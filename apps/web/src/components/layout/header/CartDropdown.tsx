import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatRialsPersian } from "../../../lib/persian-numerals";
import { useCartStore } from "../../../lib/store";

const SYSTEM_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

/**
 * CartDropdown — Live cart dropdown wired to Zustand useCartStore.
 * Shows items, quantities, totals, and links to cart/checkout pages.
 */
export function CartDropdown() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getDisplayTotal = useCartStore((s) => s.getDisplayTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Defer client-only state to avoid hydration mismatch (cart is in localStorage)
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCount = mounted ? getItemCount() : 0;
  const totalPrice = mounted ? getDisplayTotal() : 0;

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  const handleClick = useCallback(() => setIsOpen((p) => !p), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border-light bg-surface text-text-secondary shadow-sm transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-md"
        aria-label="سبد خرید"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        {totalCount > 0 && (
          <span className="absolute -inset-e-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
            {totalCount > 9 ? "۹+" : String(totalCount)}
          </span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={SYSTEM_SPRING}
            className="absolute inset-e-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border-light bg-surface-glass shadow-glass backdrop-blur-xl"
            role="dialog"
            aria-label="سبد خرید"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
              <h3 className="text-sm font-medium text-text-primary">سبد خرید</h3>
              <span className="text-xs font-medium text-text-muted">{totalCount} کالا</span>
            </div>

            {mounted && items.length > 0 ? (
              <>
                <ul className="max-h-64 overflow-y-auto p-2" role="list">
                  {items.map((item) => (
                    <li key={item.variantId}>
                      <div className="flex gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-surface-secondary">
                        <div className="flex flex-1 flex-col gap-1">
                          <Link
                            to="/products/$slug"
                            params={{ slug: item.slug }}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-medium text-text-primary no-underline transition-colors hover:text-accent line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <span className="text-[11px] text-text-muted">{item.sku}</span>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-accent">
                              {formatRialsPersian(item.effectivePrice)} تومان
                            </span>
                            <div className="flex items-center gap-1">
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="flex h-5 w-5 items-center justify-center rounded-md border border-border-light text-text-muted transition-colors hover:border-accent hover:text-accent"
                                aria-label="کاهش"
                              >
                                <Minus className="h-3 w-3" />
                              </motion.button>
                              <span className="min-w-[16px] text-center text-xs font-medium text-text-primary">
                                {item.quantity}
                              </span>
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="flex h-5 w-5 items-center justify-center rounded-md border border-border-light text-text-muted transition-colors hover:border-accent hover:text-accent"
                                aria-label="افزایش"
                              >
                                <Plus className="h-3 w-3" />
                              </motion.button>
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeItem(item.variantId)}
                                className="ms-1 flex h-5 w-5 items-center justify-center rounded-md text-text-muted transition-colors hover:text-danger"
                                aria-label="حذف"
                              >
                                <Trash2 className="h-3 w-3" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border-light p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-text-secondary">جمع کل</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {formatRialsPersian(totalPrice)} تومان
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-accent/90"
                  >
                    مشاهده سبد خرید
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 px-4 py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary">
                  <ShoppingCart className="h-6 w-6 text-text-muted" />
                </div>
                <p className="text-sm font-medium text-text-secondary">سبد خرید شما خالی است</p>
                <Link
                  to="/products"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white no-underline transition-colors hover:bg-accent/90"
                >
                  مشاهده محصولات
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CartDropdown;
