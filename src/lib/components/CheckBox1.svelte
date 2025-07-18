<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ change: { checked: boolean; dataId: string | number } }>();

  export let label: string = "Checkbox Option";
  export let id: string = "";
  export let name: string = "";
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let dataId: string | number = "";
  export let className: string = "";

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch("change", { checked: target.checked, dataId });
  }
</script>

<div class={`cursor-pointer mb-4 ${className}`}>
  <label class="flex items-center justify-between">
    <span class="flex items-center text-sm">
      <input
        type="checkbox"
        id={id}
        name={name}
        class="mr-2 w-4 h-4"
        bind:checked
        {disabled}
        data-id={dataId}
        on:change={handleChange}
      />
      {label}
    </span>
  </label>
</div>
