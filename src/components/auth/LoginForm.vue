<script setup></script>

<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field v-model="email" label="Email"></v-text-field>

    <v-text-field v-model="password" label="Password"></v-text-field>

    <v-btn class="mt-2" type="submit" color="blue" block>Submit</v-btn>
  </v-form>
</template>
