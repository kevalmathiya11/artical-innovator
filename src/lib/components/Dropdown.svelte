<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ change: string }>();

  // Props
  export let label: string = "Select Option";
  export let id: string = "dropdown";
  export let options: string[] = [];
  export let value: string = "";
  export let className: string = "w-full";
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let placeholder: string = "Select";

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    dispatch("change", target.value);
  }
</script>

<div class="flex flex-col md:flex-row items-start gap-3">
  <div class={`block ${className}`}>
    <label
      for={id}
      class="mb-2 text-sm font-medium text-gray-600 w-full flex items-center"
    >
      {label}
    </label>
    <div class="relative">
      <select
        {id}
        bind:value
        {required}
        {disabled}
        on:change={handleChange}
        class="!appearance-none bg-white border border-gray-300 text-gray-900 text-sm font-normal rounded-lg block w-full py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option disabled selected value="">{placeholder}</option>
        {#each options as option}
          <option value={option}>{option}</option>
        {/each}
      </select>

      <!-- Custom arrow -->
      <div
        class=" pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
      >
        <svg
          class="w-4 h-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</div>
