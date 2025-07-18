<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface EditorInstance {
    editor: any;
    element: HTMLElement;
    tagName: string;
  }

  let editorInstances: EditorInstance[] = [];
  let mainContainer: HTMLDivElement;
  let isEditorLoaded = false;

  const defaultConfig = {
    plugins: [
      'Essentials',
      'Autoformat',
      'Bold',
      'Italic',
      'BlockQuote',
      'CKFinder',
      'CKFinderUploadAdapter',
      'CloudServices',
      'Heading',
      'Image',
      'ImageCaption',
      'ImageStyle',
      'ImageToolbar',
      'ImageUpload',
      'Base64UploadAdapter',
      'Indent',
      'Link',
      'List',
      'Mention',
      'Paragraph',
      'PasteFromOffice',
      'PictureEditing',
      'Table',
      'TableToolbar',
      'TextTransformation',
    ],
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'link',
      'uploadImage',
      'insertTable',
      'blockQuote',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
    ],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative',
      ],
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
  };

  function loadCKEditorCSS(): void {
    // Check if CSS is already loaded
    if (document.querySelector('link[href*="ckeditor5.css"]')) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.ckeditor.com/ckeditor5/42.0.1/ckeditor5.css';
    document.head.appendChild(link);
  }

  async function loadCKEditorScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isEditorLoaded || (window as any).CKEDITOR) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.textContent = `
        import {
          InlineEditor,
          Autoformat,
          Bold,
          Italic,
          BlockQuote,
          Base64UploadAdapter,
          CKFinder,
          CKFinderUploadAdapter,
          CloudServices,
          Essentials,
          Heading,
          Image,
          ImageCaption,
          ImageStyle,
          ImageToolbar,
          ImageUpload,
          PictureEditing,
          Indent,
          Link,
          List,
          Mention,
          Paragraph,
          PasteFromOffice,
          Table,
          TableToolbar,
          TextTransformation,
        } from 'https://cdn.ckeditor.com/ckeditor5/42.0.1/ckeditor5.js';

        window.CKEditorModules = {
          InlineEditor,
          Autoformat,
          Bold,
          Italic,
          BlockQuote,
          Base64UploadAdapter,
          CKFinder,
          CKFinderUploadAdapter,
          CloudServices,
          Essentials,
          Heading,
          Image,
          ImageCaption,
          ImageStyle,
          ImageToolbar,
          ImageUpload,
          PictureEditing,
          Indent,
          Link,
          List,
          Mention,
          Paragraph,
          PasteFromOffice,
          Table,
          TableToolbar,
          TextTransformation,
        };

        window.dispatchEvent(new CustomEvent('ckeditor-loaded'));
      `;

      script.onerror = () => reject(new Error('Failed to load CKEditor script'));
      
      window.addEventListener('ckeditor-loaded', () => {
        isEditorLoaded = true;
        resolve();
      }, { once: true });

      document.head.appendChild(script);
    });
  }

  async function initializeEditors() {
    try {
      await loadCKEditorScript();
      
      const modules = (window as any).CKEditorModules;
      if (!modules) {
        throw new Error('CKEditor modules not loaded');
      }

      const actualConfig = {
        plugins: [
          modules.Essentials,
          modules.Autoformat,
          modules.Bold,
          modules.Italic,
          modules.BlockQuote,
          modules.CKFinder,
          modules.CKFinderUploadAdapter,
          modules.CloudServices,
          modules.Heading,
          modules.Image,
          modules.ImageCaption,
          modules.ImageStyle,
          modules.ImageToolbar,
          modules.ImageUpload,
          modules.Base64UploadAdapter,
          modules.Indent,
          modules.Link,
          modules.List,
          modules.Mention,
          modules.Paragraph,
          modules.PasteFromOffice,
          modules.PictureEditing,
          modules.Table,
          modules.TableToolbar,
          modules.TextTransformation,
        ],
        toolbar: defaultConfig.toolbar,
        heading: defaultConfig.heading,
        image: defaultConfig.image,
        link: defaultConfig.link,
        table: defaultConfig.table,
      };
      
      const editableElements = mainContainer.querySelectorAll('.editable');
      
      for (const element of editableElements) {
        if (!element) continue;
        
        const elementTagName = element.tagName.toLowerCase();
        
        try {
          const editor = await modules.InlineEditor.create(element, actualConfig);
          editorInstances.push({ 
            editor, 
            element: element as HTMLElement, 
            tagName: elementTagName 
          });
        } catch (error) {
          console.error('Error creating editor:', error);
        }
      }
    } catch (error) {
      console.error('Error loading CKEditor:', error);
    }
  }

  function getData() {
    let htmlContent = '';
    
    editorInstances.forEach(instance => {
      let content = instance.editor.getData();

      // Remove wrapping <p> tags if the original element was not a paragraph
      if (instance.tagName !== 'p') {
        content = content.replace(/^<p>([\s\S]*)<\/p>$/, '$1');
      }

      // Ensure the content is wrapped in the correct tag
      if (instance.tagName !== 'p') {
        content = `<${instance.tagName}>${content}</${instance.tagName}>`;
      }

      htmlContent += content;
    });
    
    alert(htmlContent);
  }

  onMount(() => {
    // Load CKEditor CSS first
    loadCKEditorCSS();

    // Add import map for CKEditor 5
    const importMap = document.createElement('script');
    importMap.type = 'importmap';
    importMap.textContent = JSON.stringify({
      imports: {
        "ckeditor5": "https://cdn.ckeditor.com/ckeditor5/42.0.1/ckeditor5.js",
        "ckeditor5/": "https://cdn.ckeditor.com/ckeditor5/42.0.1/"
      }
    });
    document.head.appendChild(importMap);

    // Initialize editors after a brief delay to ensure DOM is ready
    setTimeout(initializeEditors, 100);
  });

  onDestroy(() => {
    // Clean up editor instances
    editorInstances.forEach(instance => {
      if (instance.editor) {
        instance.editor.destroy();
      }
    });
    editorInstances = [];
  });
</script>

<div class="rounded-xl border border-solid border-gray-200 p-4">
  <div class="main-container" bind:this={mainContainer}>
    <div>
      <h2>CK EDITOR</h2>
      <h2 class="editable">Click here to edit the text using CKEditor 5!</h2>
      <img src="https://dummyimage.com/400x400/000/fff" width="100" alt="Placeholder" />
      <p class="editable">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text
        ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only
        five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the
        release
        of Letraset sheets containing Lorem Ipsum passages, and more
        recently
        with desktop publishing software like Aldus PageMaker including
        versions
        of Lorem Ipsum.
      </p>
      <p class="editable">
        Contrary to popular belief, Lorem Ipsum is not simply random text.
        It
        has roots in a piece of classical Latin literature from 45 BC,
        making it
        over 2000 years old. Richard McClintock, a Latin professor at
        Hampden-Sydney College in Virginia, looked up one of the more
        obscure
        Latin words, consectetur, from a Lorem Ipsum passage, and going
        through
        the cites of the word in classical literature, discovered the
        undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
        1.10.33
        of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil)
        by
        Cicero, written in 45 BC. This book is a treatise on the theory of
        ethics, very popular during the Renaissance. The first line of Lorem
        Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section
        1.10.32.
      </p>
      <button id="get_data" on:click={getData}>Get Data</button>
    </div>
  </div>
</div>