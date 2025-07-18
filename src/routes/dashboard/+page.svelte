<script lang="ts">
  // Your logic here
  import Input from "$lib/components/Input.svelte";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import CheckBox1 from "$lib/components/CheckBox1.svelte";
  import CheckBoxTailwind from "$lib/components/CheckBoxTailwind.svelte";
  import CheckBox2 from "$lib/components/CheckBox2.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import AuthorSelectbox from "$lib/components/AuthorSelectbox.svelte";
  import CategorySelect from "$lib/components/CategorySelect.svelte";
  import CkEditor from "$lib/components/CKEditor.svelte";
  import FlipSwitch from "$lib/components/FlipSwitch.svelte";
  import Table from "$lib/components/Table.svelte";
  import DynamicSteper from "$lib/components/DynamicSteper.svelte";
   import Pagination from "$lib/components/Pagination.svelte";

    import DatePicker from '$lib/components/DatePicker.svelte';
  import type { DateRange } from '../../types/datePicker';



  

   
  
  let currentPage = 1;
  let totalPages = 15;
  
  $: pagination = {
    currentPage,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages
  };
  
  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      // Add your page change logic here
      console.log('Page changed to:', page);
    }
  }
  
  let selectedAuthors : [] = [];
  let selectedStatus = "Radio 1";
  let categories: [] = [];
  let workspaceName: string = "";
   let selected = "";
    let isChecked = false;


 let currentDateRange: DateRange = {

    startDate: '',

    endDate: ''

  };

  

  function handleDateChange(event: CustomEvent<DateRange>) {

    currentDateRange = event.detail;

    console.log('Date changed:', currentDateRange);

  }

  

  function handleApply(event: CustomEvent<DateRange>) {

    console.log('Applied date range:', event.detail);

    // Handle apply logic here (e.g., fetch data, update charts, etc.)

  }

  

  function handleClear() {

    console.log('Date range cleared');

    currentDateRange = { startDate: '', endDate: '' };

  }

   

</script>

<h1 class="text-2xl font-bold mb-4">Dashboard</h1>
<p>Welcome to the dashboard!</p>
<Input
    bind:value={workspaceName}
    label="Workspace Name"
    readonly={false}
    id="workspace"
    name="workspace"
    placeholder="Enter workspace name"
    type="text"
    minlength={3}
    maxlength={30}
    required={true}
    className="w-[300px]"
  />

  
<Dropdown
  label="Choose Demo"
  bind:value={selected}
  placeholder="Select an option"
  options={["Demo 1", "Demo 2", "Demo 3"]}
  className="w-[300px]"
/>

<CheckBox1
  label="Checkbox Option 1"
  bind:checked={isChecked}
  id="option1"
  dataId="1"
/>

<CheckBoxTailwind
  id="customCheck1"
  label="Checkbox Tailwind"
  name="custom"
  bind:checked={isChecked}
/>

<CheckBox2
  id="check-2"
  label="Checkbox Option 2"
  bind:checked={isChecked}
/>
<RadioGroup
  name="status"
  bind:selected={selectedStatus}
  options={["Radio 1", "Radio 2", "Radio 3"]}/>
<!-- here remainig to add className property in component -->
<AuthorSelectbox

  bind:selectedMembers={selectedAuthors} 
  placeholder="Search authors..." 
  
/>
<CategorySelect
  bind:selectedCategories={categories} 
  placeholder="Search categories..."
  className="w-[300px]"/>

<CkEditor
/>
  
<FlipSwitch
  bind:checked={isChecked}/>

<Table/>

<DynamicSteper
/>
<Pagination {pagination} {handlePageChange} />

      <DatePicker

        initialStartDate=""

        initialEndDate=""

        placeholder="Select date range"

        on:dateChange={handleDateChange}

        on:apply={handleApply}

        on:clear={handleClear}

      />