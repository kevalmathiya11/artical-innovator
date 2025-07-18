<script lang="ts">
  let currentStep: number = 1;
  const totalSteps: number = 3;

  interface StepData {
    title: string;
    description: string;
    content: string;
    bgColor: string;
    textColor: string;
  }

  const stepData: StepData[] = [
    {
      title: "Step 1: Connect",
      description: "Set up your connection settings and establish the initial link to your system.",
      content: "Configure your connection parameters here.",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800"
    },
    {
      title: "Step 2: Configurations", 
      description: "Customize your settings and preferences to match your requirements.",
      content: "Adjust your configuration options here.",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800"
    },
    {
      title: "Step 3: Assign",
      description: "Assign roles and finalize your setup process.",
      content: "Complete your assignments and finish the setup.",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800"
    }
  ];

  function getCircleClasses(step: number): string {
    if (step <= currentStep) {
      return 'flex items-center justify-center w-[34px] h-[34px] bg-indigo-500 text-white rounded-full transition-colors duration-300';
    } else {
      return 'flex items-center justify-center w-[34px] h-[34px] bg-gray-200 text-gray-400 rounded-full transition-colors duration-300';
    }
  }

  function getLineClasses(step: number): string {
    if (step < currentStep) {
      return 'flex-1 h-0.5 bg-indigo-500 transition-colors duration-300';
    } else {
      return 'flex-1 h-0.5 bg-gray-300 transition-colors duration-300';
    }
  }

  function getPrevBtnClasses(): string {
    if (currentStep === 1) {
      return 'px-6 py-3 bg-gray-200 text-gray-400 rounded-lg font-medium transition-all duration-300 cursor-not-allowed';
    } else {
      return 'px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 cursor-pointer';
    }
  }

  function getNextBtnClasses(): string {
    if (currentStep === totalSteps) {
      return 'px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300';
    } else {
      return 'px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300';
    }
  }

  function handleNext(): void {
    if (currentStep < totalSteps) {
      currentStep++;
    } else {
      alert('Process completed!');
    }
  }

  function handlePrev(): void {
    if (currentStep > 1) {
      currentStep--;
    }
  }
</script>

<div class="mt-4 p-5 border border-gray-200 rounded-2xl bg-white">
  <div class="max-w-4xl mx-auto">
    <!-- Progress Steps -->
    <div class="p-4 mb-4 border border-gray-200 rounded-2xl bg-white">
      <div class="flex items-center justify-between max-md:block space-y-2">
        <!-- Step 1 -->
        <div class="flex-1 flex items-center justify-center">
          <div class={getCircleClasses(1)}>
            1
          </div>
          <p class="text-sm text-gray-500 ml-2">Connect</p>
        </div>
        <div class={getLineClasses(1)}></div>
        
        <!-- Step 2 -->
        <div class="flex-1 flex items-center justify-center">
          <div class={getCircleClasses(2) + " ml-2"}>
            2
          </div>
          <p class="text-sm text-gray-500 ml-2 mr-2">Configurations</p>
        </div>
        <div class={getLineClasses(2)}></div>
        
        <!-- Step 3 -->
        <div class="flex-1 flex items-center justify-center">
          <div class={getCircleClasses(3)}>
            3
          </div>
          <p class="text-sm text-gray-500 ml-2">Assign</p>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="bg-white p-8 rounded-2xl border border-gray-200 mb-6">
      <div id="step-content">
        {#each stepData as step, index}
          {#if index + 1 === currentStep}
            <div class="step-content">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">{step.title}</h2>
              <p class="text-gray-600 mb-4">{step.description}</p>
              <div class="{step.bgColor} p-4 rounded-lg">
                <p class={step.textColor}>{step.content}</p>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between items-center">
      <button 
        class={getPrevBtnClasses()}
        disabled={currentStep === 1}
        on:click={handlePrev}
      >
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Previous
        </span>
      </button>
      
      <div class="flex space-x-2">
        <span class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      
      <button 
        class={getNextBtnClasses()}
        on:click={handleNext}
      >
        <span class="flex items-center">
          {#if currentStep === totalSteps}
            Complete
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          {:else}
            Next
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          {/if}
        </span>
      </button>
    </div>
  </div>
</div>