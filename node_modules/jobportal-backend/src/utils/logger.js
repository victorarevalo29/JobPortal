export const logger = {
  info: (message, ...params) => console.log(`[INFO] ${message}`, ...params),
  warn: (message, ...params) => console.warn(`[WARN] ${message}`, ...params),
  error: (message, ...params) => console.error(`[ERROR] ${message}`, ...params)
}
