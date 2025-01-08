import type { EventHandler, EventHandlerRequest, H3Event } from "h3";
import type { z } from "zod";
import { ZodError } from "zod";

type ApiEventHandler<
  T extends EventHandlerRequest,
  D,
  S extends z.ZodType | undefined = undefined
> = {
  validation?: S;
  handler: (
    event: H3Event<T>,
    payload: S extends z.ZodType ? z.infer<S> : unknown
  ) => Promise<D> | D;
};

export function defineApiEventHandler<
  T extends EventHandlerRequest = EventHandlerRequest,
  D = unknown,
  S extends z.ZodType | undefined = undefined
>(
  handlerOrConfig: ApiEventHandler<T, D, S> | EventHandler<T, D>
): EventHandler<T, D> {
  if (typeof handlerOrConfig === "function") {
    return defineEventHandler(handlerOrConfig);
  }

  const { validation, handler } = handlerOrConfig;

  return defineEventHandler<T>(async (event) => {
    try {
      const data = await getPayload(event);
      const payload = validation ? await validation.parseAsync(data) : data;
      return handler(event, payload);
    } catch (err) {
      if (err instanceof ZodError) {
        throw createError({
          statusCode: 422,
          statusMessage: `Invalid request payload`,
          data: err,
        });
      }
      throw err;
    }
  });
}

// Local function to get the payload from the event
// should NOT be exported
async function getPayload(event: H3Event) {
  const method = event.method;

  let payload: Record<string, unknown> = getQuery(event) || {};

  if (["PUT", "POST"].includes(method)) {
    const body = await readBody(event);
    payload = {
      ...payload,
      ...body,
    };
  }

  return {
    ...payload,
    ...event.context.params,
  };
}
