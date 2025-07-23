<script lang="ts">
  import "../app.css"; // Tailwind CSS import
  import Header from "$lib/layouts/Header.svelte";
  import Sidebar from "$lib/layouts/Sidebar.svelte";
  import { isSidebarOpen } from "$lib/stores/sidebar";
  import GlobalLoader from "$lib/components/GlobalLoader.svelte";
</script>

<!-- Root Wrapper -->
<div>
    <!-- Global Loader -->
    <GlobalLoader />
  <div class="flex overflow-y-hidden bg-white">
  
    <!-- Sidebar -->
    <Sidebar />
    <div
      class="h-full overflow-hidden border-l border-solid border-gray-200 lg:ml-auto max-lg:w-full relative"
      class:lg:w-[calc(100%-256px)]={$isSidebarOpen}
      class:lg:w-[calc(100%-80px)]={!$isSidebarOpen}
    >
      <!-- Header -->
      <Header />
      <!-- Routed Page Content -->
      <main class="w-full px-8 py-6 pt-28 h-[calc(100vh-0px)] overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</div>
