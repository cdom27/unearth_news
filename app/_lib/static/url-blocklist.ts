/**
 * A blocklist of news source domains that should be skipped during parsing and analysis.
 *
 * These sources are explicitly excluded to prevent unnecessary processing failures
 * caused by:
 * - Hard paywalls or subscription gates
 * - Aggressive anti-bot/scraping protection
 * - Non-standard DOM structures that are incompatible
 */
export const urlBlocklist = ["bloomberg.com"];
