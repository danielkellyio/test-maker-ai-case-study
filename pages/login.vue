<script setup lang="ts">
// Use Supabase client for authentication
const client = useSupabaseClient();
const user = useSupabaseUser();

// Form data
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

// Handle login form submission
async function handleLogin() {
  try {
    loading.value = true;
    error.value = null;

    const { error: authError } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;

    // Redirect on success
    navigateTo("/dashboard");
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "An unknown error occurred";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="flex justify-center items-center px-4 py-12 min-h-screen bg-background sm:px-6 lg:px-8"
  >
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-center">Sign in to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" :disabled="loading" class="w-full">
            <Icon
              name="heroicons:lock-closed"
              class="mr-2 w-4 h-4"
              aria-hidden="true"
            />
            {{ loading ? "Signing in..." : "Sign in" }}
          </Button>

          <div class="text-sm text-center text-muted-foreground">
            Don't have an account?
            <NuxtLink
              to="/register"
              class="font-medium text-primary hover:underline"
              >Create an account</NuxtLink
            >
          </div>

          <Alert v-if="error" variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {{ error }}
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
