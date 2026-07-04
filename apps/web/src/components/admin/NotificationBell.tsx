import { BellIcon, CheckCheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";
import { trpc } from "../../lib/trpc";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

/** Format an ISO timestamp as a short relative Persian label. */
function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "همین حالا";
  if (min < 60) return `${min.toLocaleString("fa-IR")} دقیقه پیش`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr.toLocaleString("fa-IR")} ساعت پیش`;
  const day = Math.floor(hr / 24);
  return `${day.toLocaleString("fa-IR")} روز پیش`;
}

/**
 * NotificationBell — admin/operator in-app notifications.
 *
 * Two delivery layers:
 * 1. tRPC polling (unread count + list, ~15s) — the reliable source of truth.
 * 2. socket.io push (/admin-notifications) — instant pop + query invalidation,
 *    so a dropped socket never loses a notification (polling backfills it).
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const socketRef = useRef<Socket | null>(null);

  const unreadQuery = trpc.admin.unreadNotificationCount.useQuery(undefined, {
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
  const listQuery = trpc.admin.listNotifications.useQuery(
    { limit: 30 },
    { refetchInterval: 15_000 },
  );
  const markAllRead = trpc.admin.markAllNotificationsRead.useMutation({
    onSuccess: () => {
      utils.admin.unreadNotificationCount.invalidate();
      utils.admin.listNotifications.invalidate();
    },
  });

  // Live push channel.
  useEffect(() => {
    const socket = io("/admin-notifications", {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("notification", (payload: { title?: string; body?: string }) => {
      utils.admin.unreadNotificationCount.invalidate();
      utils.admin.listNotifications.invalidate();
      toast.success(payload.title ?? "اعلان جدید", { description: payload.body });
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [utils]);

  const unread = unreadQuery.data?.count ?? 0;
  const notifications = listQuery.data?.notifications ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors duration-200 hover:bg-surface-action hover:text-text-primary"
        aria-label="اعلان‌ها"
      >
        <BellIcon className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -end-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-4 text-white">
            {unread > 99 ? "۹۹+" : unread.toLocaleString("fa-IR")}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 gap-0 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <span className="text-sm font-semibold text-text-primary">اعلان‌ها</span>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="flex items-center gap-1 text-xs font-medium text-accent transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              <CheckCheckIcon className="h-3.5 w-3.5" />
              خواندن همه
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-xs font-medium text-text-muted">
              اعلانی وجود ندارد
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex flex-col gap-1 border-b border-border px-3 py-2.5 last:border-b-0 ${
                  n.isRead ? "" : "bg-accent/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-text-primary">{n.title}</span>
                  <span className="shrink-0 text-[10px] font-medium text-text-muted">
                    {relativeTime(n.createdAt)}
                  </span>
                </div>
                <span className="text-xs font-medium text-text-secondary leading-relaxed">
                  {n.body}
                </span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
