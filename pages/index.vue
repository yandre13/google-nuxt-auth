<template>
  <header class="max-w-6xl px-4 mx-auto py-6 flex justify-end">
    <UButton v-if="loggedIn" @click="handleSignOut">Sign Out</UButton>
    <UButton v-else @click="handleSignIn">
      <IconsGoogle />
      <span> Sign In with Google </span>
    </UButton>
  </header>
  <section class="max-w-6xl px-4 mx-auto" v-if="loggedIn">
    <div class="flex items-center gap-4">
      <p>
        Logged in as <strong>{{ data.user.name }}</strong>
      </p>
      <img
        class="w-8 h-8 rounded-full mr-2"
        :src="data.user.image"
        :alt="data.user.name"
      />
    </div>
  </section>
</template>

<script setup>
const { data, signIn, signOut, status } = useAuth()
console.log(status.value, data.value?.user)
const loggedIn = computed(() => status.value === 'authenticated')

async function handleSignIn() {
  await signIn('google')
}
async function handleSignOut() {
  await signOut()
}
</script>
