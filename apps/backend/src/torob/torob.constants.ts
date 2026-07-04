/**
 * Torob integration constants.
 *
 * Sourced verbatim from the official Torob integration docs:
 * - docs/torob/torob_api_token_guide.md  (public key)
 * - docs/torob/product_api_v3.md          (api_version string)
 */

/**
 * Torob's EdDSA (ed25519) public key, used to verify the `X-Torob-Token` JWT
 * signature on inbound requests from Torob's backend.
 *
 * Per the token guide, the JWT algorithm is EdDSA.
 */
export const TOROB_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAt6Mu4T0pBORY11W+QeM35UsmLO3vsf+6yKpFDEImFk0=
-----END PUBLIC KEY-----`;

/**
 * Required `api_version` value for the Product API v3 response envelope.
 * Per spec, every product feed response must include `"api_version": "torob_api_v3"`.
 */
export const TOROB_API_VERSION = "torob_api_v3";

/**
 * HTTP header carrying the Torob JWT (base64-encoded compact serialization).
 */
export const TOROB_TOKEN_HEADER = "x-torob-token";

/**
 * HTTP header carrying the Torob token scheme version (currently `1`).
 */
export const TOROB_TOKEN_VERSION_HEADER = "x-torob-token-version";

/**
 * Products per page for the Product API v3 feed. The spec mandates exactly 100
 * items per page (except the last page).
 */
export const TOROB_PRODUCTS_PER_PAGE = 100;

/**
 * Attribution window: Torob attributes any purchase within 7 days (168h) of the
 * click. Used as the TTL for the `torob_clid` capture cookie.
 */
export const TOROB_ATTRIBUTION_WINDOW_SECONDS = 7 * 24 * 60 * 60;
