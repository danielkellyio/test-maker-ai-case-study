export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        email: user.email,
        avatar: user.avatar_url,
      },
    });
    return sendRedirect(event, "/");
  },
});
