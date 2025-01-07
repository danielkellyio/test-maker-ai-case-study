import { H3Event } from "h3";

interface Comment {
  id: string;
  name: string;
  date: string;
  content: string;
  path: string;
}

export default defineEventHandler(async (event: H3Event) => {
  const storage = useStorage();
  const pathParams = getRouterParams(event);
  const path = Array.isArray(pathParams.path)
    ? pathParams.path.join("/")
    : pathParams.path;
  const storageKey = `comments:${btoa(path)}`;

  if (event.method === "GET") {
    return (await storage.getItem(storageKey)) || [];
  }

  if (event.method === "POST") {
    // Get the user session (will throw 401 if not authenticated)
    const session = await requireUserSession(event);
    const body = await readBody(event);

    const comment = {
      id: crypto.randomUUID(),
      content: body.content,
      author: {
        name: session.user.name || session.user.login,
        avatar: session.user.avatar,
        githubUsername: session.user.login,
      },
      createdAt: new Date().toISOString(),
      path,
    };

    const comments = (await storage.getItem(storageKey)) || [];
    const updatedComments = [...comments, comment];
    await storage.setItem(storageKey, updatedComments);

    return comment;
  }
});
