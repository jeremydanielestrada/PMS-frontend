<script setup>
import { computed, ref } from 'vue'
const props = defineProps(['text', 'isConfirmVisible', 'title', 'isLoading', 'subject'])
const emits = defineEmits(['update:isConfirmVisible', 'confirm'])

const modal = computed({
  get: () => props.isConfirmVisible,
  set: (value) => emits('update:isConfirmVisible', value),
})

const confirmAction = () => {
  emits('confirm')
  modal.value = false
}
const loader = ref(true)
</script>

<template>
  <v-dialog width="300" v-model="modal" persistent>
    <v-card :subtitle="props.title">
      <v-card-text class="d-flex justify-center align-center">
        <div class="d-flex flex-column ga-2 align-center" v-if="props.isLoading">
          <v-progress-circular color="primary" size="50" indeterminate></v-progress-circular>
          <small>{{ props.subject }}</small>
        </div>

        <p v-else>{{ props.text }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="modal = false">Cancel</v-btn>
        <v-btn @click="confirmAction">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
