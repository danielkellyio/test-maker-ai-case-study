import type { EventHandler, EventHandlerRequest, H3Event } from "h3";
import type { z } from "zod";
import { ZodError } from "zod";
import type { Guard } from "./guards";
type ApiEventHandler<
  T extends EventHandlerRequest,
  D,
  S extends z.ZodType | undefined = undefined
> = {
  validation?: S;
  guards?: Guard[];
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

  const { validation, handler, guards } = handlerOrConfig;

  return defineEventHandler<T>(async (event) => {
    try {
      // get the rawData
      const rawData = await getPayload(event);

      // validate the rawData and transform it to the payload
      const payload = await runValidation(rawData, validation);

      // run guards
      await runGuards(event, payload, guards);

      // run the handler
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
  console.log("payload", payload);

  return {
    ...payload,
    ...event.context.params,
  };
}

// local function to run guards
async function runGuards(event: H3Event, payload: unknown, guards?: Guard[]) {
  if (!Array.isArray(guards)) {
    throw createError({
      statusCode: 500,
      statusMessage: `Guards must be an array`,
    });
  }
  await Promise.all(guards.map((guard) => guard(event, payload)));
}

// local function to run validation
async function runValidation(data: unknown, validation?: z.ZodType) {
  return validation ? await validation.parseAsync(data) : data;
}
