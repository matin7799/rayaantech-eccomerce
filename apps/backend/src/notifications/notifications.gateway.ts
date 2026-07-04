import { Logger } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { Server } from "socket.io";
import type { NotificationRow } from "./notifications.service";

/**
 * WebSocket gateway for live admin/operator notification push.
 *
 * Namespace: /admin-notifications (proxied in dev via vite.config.ts).
 * The admin panel connects here and listens for the "notification" event.
 * Persistence + the polled unread badge (tRPC) remain the source of truth, so a
 * dropped socket never loses a notification — this is the instant-delivery layer.
 *
 * v1 broadcasts to every connected client; only the admin panel opens this
 * connection. Payloads carry no secrets beyond what adminProcedure already serves.
 */
@WebSocketGateway({
  namespace: "/admin-notifications",
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
})
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server!: Server;

  /** Push a freshly-created notification to all connected admins. */
  broadcast(notification: NotificationRow): void {
    if (!this.server) return;
    this.server.emit("notification", notification);
    this.logger.debug(`Pushed notification ${notification.id} (${notification.type})`);
  }
}
