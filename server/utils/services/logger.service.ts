import type { H3Event } from "h3";

export function useLoggerService(event?: H3Event) {
  function log(message: string) {
    if (import.meta.dev) {
      useStorage("logs").setItem(new Date().toISOString(), message);
    } else {
      console.log(message);
    }
  }

  return {
    log,
  };
}
