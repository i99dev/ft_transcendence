<template>
  <div>
      <TransitionRoot as="template" :show="props?.show || false">
          <Dialog as="div" class="relative z-10">
              <div class="fixed inset-0" />

              <div class="fixed inset-0 overflow-hidden">
                  <div class="absolute inset-0 overflow-hidden">
                      <div
                          class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16"
                      >
                          <TransitionChild
                              as="template"
                              enter="duration-300 ease-out"
                              enter-from="opacity-0"
                              enter-to="opacity-100"
                              leave="duration-200 ease-in"
                              leave-from="opacity-100"
                              leave-to="opacity-0"
                          >
                              <div class="fixed inset-0 bg-background bg-opacity-40" />
                          </TransitionChild>
                          <TransitionChild
                              as="template"
                              enter="transform transition ease-in-out duration-500 sm:duration-700"
                              enter-from="translate-x-full"
                              enter-to="translate-x-0"
                              leave="transform transition ease-in-out duration-500 sm:duration-700"
                              leave-from="translate-x-0"
                              leave-to="translate-x-full"
                          >
                              <DialogPanel class="pointer-events-auto w-screen max-w-md z-10">
                                <slot />
                              </DialogPanel>
                          </TransitionChild>
                      </div>
                  </div>
              </div>
          </Dialog>
      </TransitionRoot>
  </div>
</template>

<script lang="ts" setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
const props = defineProps(['show'])
</script>
