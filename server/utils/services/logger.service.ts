export function useLoggerService() {
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
