<template>
    <div class="game-options">
        <Toast />
        <SpeedDial
            :model="items"
            :transitionDelay="80"
            :radius="70"
            showIcon="pi pi-bars"
            hideIcon="pi pi-times"
            type="semi-circle"
            direction="up"
        />
    </div>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const items = ref([
    {
        label: 'Add',
        icon: 'pi pi-pencil',
        command: () => {
            console.log('Add')
            toast.add({ severity: 'info', summary: 'Add', detail: 'Data Added' })
        },
    },
    {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
            toast.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' })
        },
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
            toast.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' })
        },
    },
    {
        label: 'Upload',
        icon: 'pi pi-upload',
        command: () => {
            useRouter().push('/play')
        },
    },
    {
        label: 'Exit Game',
        icon: 'pi pi-external-link',
        command: () => {
            useRouter().push('/')
        },
    },
])
</script>
