<script lang="ts">
  import '../app.css'; // Tailwind CSS import
  import Header from '$lib/layouts/Header.svelte';
  import Sidebar from '$lib/layouts/Sidebar.svelte';
  import { isSidebarOpen } from '$lib/stores/sidebar';
</script>

<div class="">
  <!-- Sidebar -->
  <div class="flex overflow-y-hidden bg-white">
    <Sidebar />
  </div>
  
  <!-- Content Area -->
  <div
    class="h-full overflow-hidden border-l border-solid border-gray-200 lg:ml-auto max-lg:w-full relative"
    class:lg:w-[calc(100%-256px)]={$isSidebarOpen}
    class:lg:w-[calc(100%-80px)]={!$isSidebarOpen}>
    <!-- Header -->
    <Header />
  </div>
  
  <!-- Routed Page Content -->
  <main 
    class="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out"
    class:lg:ml-64={$isSidebarOpen}
    class:lg:ml-20={!$isSidebarOpen}
    class:max-lg:ml-0={true}>
    <slot />
  </main>
</div>