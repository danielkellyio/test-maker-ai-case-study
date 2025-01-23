import type { H3Event } from "h3";
export const guardsDir = "./server/utils/guards";
export * from "./authGuards";

export function defineAuthGuard(
  callback: (event: H3Event, payload: unknown) => Promise<void | never>
) {
  return callback;
}

export type Guard = (event: H3Event, payload: unknown) => Promise<void | never>;
