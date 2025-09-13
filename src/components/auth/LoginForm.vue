<script setup></script>

<template>
  <v-form fast-fail @submit.prevent>
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn class="mt-2" type="submit" color="blue" block>Submit</v-btn>
  </v-form>
</template>
