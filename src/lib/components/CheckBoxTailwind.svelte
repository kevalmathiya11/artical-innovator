<script lang="ts">
  export let id: string = "styled-checkbox";
  export let name: string = "";
  export let label: string = "Checkbox Tailwind";
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let className: string = "";
</script>

<div class={`flex items-center mb-4 ${className}`}>
  <input
    {id}
    {name}
    type="checkbox"
    bind:checked
    {disabled}
    class="w-5 h-5 cursor-pointer appearance-none border border-gray-300 rounded-md mr-2
      checked:bg-indigo-600 checked:border-indigo-500
      relative
      after:content-[''] after:absolute after:top-[-1px] after:left-[5px] after:text-white
      checked:after:content-['✓'] checked:after:text-white"
  />
  <label for={id} class="text-sm font-normal cursor-pointer">{label}</label>
</div>
