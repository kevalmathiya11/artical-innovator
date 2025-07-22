<!-- src/lib/components/GlobalLoader.svelte -->
<script lang="ts">
  import { isGlobalLoading } from '../stores/loader';
</script>

{#if $isGlobalLoading}
  <!-- Fullscreen loader with backdrop -->
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-100 flex items-center justify-center">
    <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
{/if}
