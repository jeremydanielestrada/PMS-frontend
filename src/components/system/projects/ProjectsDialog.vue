<script setup>
import { ref, computed } from 'vue'
const props = defineProps(['isDialogVisible', 'projectData'])
const emit = defineEmits(['update:isDialogVisible'])

const dialog = computed({
  get: () => props.isDialogVisible,
  set: (status) => emit('update:isDialogVisible', status),
})
</script>

<template>
  <v-dialog v-model="dialog" width="500" persistent>
    <v-card>
      <v-card-text>
        <v-form>
          <v-text-field label="Project Name"></v-text-field>
          <v-select
            label="Select Owner"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
          ></v-select>
          <v-textarea label="Description"></v-textarea>
          <v-date-input label="Select Date" variant="underlined"></v-date-input>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
