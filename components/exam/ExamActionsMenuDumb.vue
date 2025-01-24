<script setup lang="ts">
// Define props for the component
defineProps<{
  /** The ID of the exam this menu is for */
  examId: string;
}>();

// Define emits for menu actions
const emit = defineEmits<{
  /** Emitted when user clicks any menu action */
  (e: "generate" | "take" | "edit" | "scan"): void;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="focus:outline-none">
      <Button variant="outline" size="icon">
        <Icon
          name="heroicons:ellipsis-horizontal"
          class="w-5 h-5 text-muted-foreground"
        />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="emit('generate')">
        <Icon name="heroicons:document-plus" class="mr-2 w-4 h-4" />
        Generate Exam
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('take')">
        <Icon name="heroicons:pencil-square" class="mr-2 w-4 h-4" />
        Take Exam
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('edit')">
        <Icon name="heroicons:pencil" class="mr-2 w-4 h-4" />
        Edit Questions
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('scan')">
        <Icon name="heroicons:document-arrow-up" class="mr-2 w-4 h-4" />
        Scan Additional Pages
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
