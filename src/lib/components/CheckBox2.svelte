<script lang="ts">
  export let id: string = "checkbox-option";
  export let name: string = "";
  export let label: string = "Checkbox Option 2";
  export let checked: boolean = false;
  export let disabled: boolean = false;
</script>

<div class="customd-checkbox flex items-center space-x-2 mb-4">
  <label class="container-chekbox flex items-center">
    <input
      type="checkbox"
      {id}
      {name}
      bind:checked
      {disabled}
      class="w-4 h-4"
    />
    <div class="checkmark"></div>
  </label>
  <div class="flex items-center">
    <span class="text-sm">{label}</span>
  </div>
</div>

<style>
  .container-chekbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .container-chekbox {
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 20px;
    user-select: none;
  }

  .checkmark {
    position: relative;
    top: 0;
    left: 0;
    height: 1.2em;
    width: 1.2em;
    background: #fff;
    border-radius: 5px;
    border: 2px solid #ddd;
  }

  .container-chekbox input:checked ~ .checkmark {
    background-image: linear-gradient(#4f46e5, #4f46e5);
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .container-chekbox input:checked ~ .checkmark:after {
    display: block;
  }

  .container-chekbox .checkmark:after {
    left: 8px;
    top: 5px;
    width: 0.27em;
    height: 0.5em;
    border: solid white;
    border-width: 0 0.1em 0.1em 0;
    transform: rotate(45deg);
  }
</style>
