<script setup lang="ts">
// Use Supabase client for authentication
const client = useSupabaseClient();
const user = useSupabaseUser();

// Form data
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

// Handle registration form submission
async function handleRegister() {
  try {
    loading.value = true;
    error.value = null;

    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      throw new Error("Passwords do not match");
    }

    const { error: authError } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;

    // Redirect to login page with success message
    navigateTo("/login");
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
        <CardTitle class="text-center">Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleRegister">
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
              placeholder="Create a password"
            />
          </div>

          <div class="space-y-2">
            <Label for="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="Confirm your password"
            />
          </div>

          <Button type="submit" :disabled="loading" class="w-full">
            <Icon
              name="heroicons:user-plus"
              class="mr-2 w-4 h-4"
              aria-hidden="true"
            />
            {{ loading ? "Creating account..." : "Create account" }}
          </Button>

          <Alert v-if="error" variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {{ error }}
            </AlertDescription>
          </Alert>

          <div class="text-sm text-center text-muted-foreground">
            Already have an account?
            <NuxtLink
              to="/login"
              class="font-medium text-primary hover:underline"
              >Sign in</NuxtLink
            >
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
