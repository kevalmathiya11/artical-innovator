<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ input: string }>();

  // Props
  export let value: string = "";
  export let placeholder: string = "Workspace Name";
  export let id: string = "default-search";
  export let required: boolean = true;
  export let type: string = "text";
  export let name: string = "";
  export let label: string = "Input";
  export let className: string = "";
  export let minlength: number | undefined = undefined;
  export let maxlength: number | undefined = undefined;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let readonly: boolean = false;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch("input", target.value);
  }
</script>

<div class="flex flex-col md:flex-row items-start gap-3">
  <div class="block w-full">
    <label
      for={id}
      class="mb-2 text-sm font-medium text-gray-600 w-full flex items-center"
    >
      {label}
    </label>
    <input
      bind:value
      {id}
      {type}
      {name}
      {placeholder}
      {required}
      {readonly}
      {minlength}
      {maxlength}
      {min}
      {max}
      on:input={handleInput}
      class={`block  px-3 py-1.5 pr-8 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed ${className}`}
    />
  </div>
</div>
