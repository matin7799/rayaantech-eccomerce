/**
 * Injection token for the KafkaJS client instance.
 */
export const KAFKA_CLIENT = Symbol("KAFKA_CLIENT");

/**
 * Kafka topic for asynchronous SMS/OTP notification dispatch.
 */
export const TOPIC_NOTIFICATION_SMS = "notification.sms";

/**
 * Kafka topic for catalog mutation events (embedding regeneration, sync).
 */
export const TOPIC_CATALOG_MUTATION = "catalog.mutation";

/**
 * Kafka topic for order cancellation events.
 * Dispatched when an admin processes an order cancellation.
 * Downstream consumers handle refund processing, inventory restoration,
 * and customer notification delivery.
 */
export const TOPIC_ORDER_CANCELLATION = "order.cancellation";
