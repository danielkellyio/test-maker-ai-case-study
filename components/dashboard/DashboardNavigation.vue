<template>
  <nav class="flex justify-between items-center p-4 border-b bg-background">
    <div class="flex items-center space-x-4">
      <NuxtLink
        to="/dashboard"
        class="text-xl font-bold text-foreground hover:text-primary"
      >
        Test Maker
      </NuxtLink>

      <!-- Main navigation links -->
      <div class="hidden space-x-4 md:flex">
        <NuxtLink
          to="/dashboard/exams"
          class="text-sm text-muted-foreground hover:text-foreground"
        >
          Exams
        </NuxtLink>
        <NuxtLink
          to="/dashboard/questions"
          class="text-sm text-muted-foreground hover:text-foreground"
        >
          Question Bank
        </NuxtLink>
        <NuxtLink
          to="/dashboard/results"
          class="text-sm text-muted-foreground hover:text-foreground"
        >
          Results
        </NuxtLink>
      </div>
    </div>

    <!-- User menu -->
    <div class="flex items-center space-x-4">
      <Button variant="ghost" size="icon">
        <Icon
          name="heroicons:bell"
          class="w-5 h-5 text-muted-foreground"
          aria-hidden="true"
        />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative w-8 h-8 rounded-full">
            <Avatar>
              <AvatarImage src="https://avatar.iran.liara.run/public/boy" />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Icon name="heroicons:user" class="mr-2 w-4 h-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="heroicons:cog-6-tooth" class="mr-2 w-4 h-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="signOut()">
            <Icon
              name="heroicons:arrow-left-on-rectangle"
              class="mr-2 w-4 h-4"
            />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>
</template>
<script setup lang="ts">
const { auth } = useSupabaseClient();

const signOut = async () => {
  await auth.signOut();
  navigateTo("/login");
};
</script>
