<script setup>
import { computed } from 'vue'
const props = defineProps(['text', 'isConfirmVisible', 'title'])
const emits = defineEmits(['update:isConfirmVisible', 'confirm'])

const modal = computed({
  get: () => props.isConfirmVisible,
  set: (value) => emits('update:isConfirmVisible', value),
})

const confirmAction = () => {
  emits('confirm')
  modal.value = false
}
</script>

<template>
  <v-dialog width="300" v-model="modal" persistent>
    <v-card :title="props.title">
      <v-card-text>
        <p>{{ props.text }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="modal = false">Cancel</v-btn>
        <v-btn @click="confirmAction">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
