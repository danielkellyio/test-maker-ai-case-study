import type { Ref } from "vue";

interface InlineEditOptions<T> {
  initialValue: T;
  onSave: (value: T) => Promise<void>;
  validate?: (value: T) => boolean;
}

export function useInlineEdit<T>({
  initialValue,
  onSave,
  validate,
}: InlineEditOptions<T>) {
  // State
  const isEditing = ref(false);
  const editedValue = ref(initialValue) as Ref<T>;
  const previousValue = ref(initialValue) as Ref<T>;

  // Start editing
  function startEdit() {
    previousValue.value = editedValue.value;
    isEditing.value = true;
  }

  // Cancel editing
  function cancelEdit() {
    editedValue.value = previousValue.value;
    isEditing.value = false;
  }

  // Save changes
  async function saveChanges() {
    if (validate && !validate(editedValue.value)) return;

    try {
      await onSave(editedValue.value);
      isEditing.value = false;
      previousValue.value = editedValue.value;
    } catch (error) {
      console.error("Failed to save changes:", error);
      // Optionally revert on error
      editedValue.value = previousValue.value;
    }
  }

  // Handle keyboard events
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveChanges();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  }

  // Update value from external changes
  function updateValue(newValue: T) {
    editedValue.value = newValue;
    previousValue.value = newValue;
  }

  return {
    isEditing,
    editedValue,
    startEdit,
    cancelEdit,
    saveChanges,
    handleKeyDown,
    updateValue,
  };
}
