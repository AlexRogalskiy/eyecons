<script lang="ts">
  import { getHighlighter, loadTheme, setWasm } from 'shiki'
  import { themes } from '../../data/themes'

  export let theme: (typeof themes)[number]['id']

  let updateCSS = (colors: Record<string, string>) => {
    let root = document.documentElement
    let set = (key: string, value: string) => {
      root.style.setProperty(key, value)
    }
    set('--view-background-primary', colors['editor.background'])
    set('--view-color-primary', colors['editor.foreground'])
    set('--view-border-active', colors['editor.foreground'])
    set(
      '--view-border',
      !colors['tab.border'].startsWith(colors['editor.background'])
        ? colors['tab.border']
        : colors['editorGroup.border'],
    )

    set(
      '--view-background-secondary',
      !colors['tab.activeBackground'].startsWith(colors['editor.background'])
        ? colors['tab.activeBackground']
        : colors['tab.inactiveBackground'],
    )
  }

  let getHighlightedCode = async (colorThemeName: string): Promise<string> => {
    let wasmResponse = await fetch('/onig.wasm')
    let wasmBuffer = await wasmResponse.arrayBuffer()
    setWasm(wasmBuffer)

    let colorTheme = await loadTheme(`/themes/${colorThemeName}.json`)
    if (colorTheme.colors) {
      updateCSS(colorTheme.colors)
    }

    let highlighter = await getHighlighter({
      theme: colorTheme,
      langs: ['javascript'],
    })

    await highlighter.loadLanguage('javascript')

    return highlighter.codeToHtml('const a = 1', {
      lang: 'javascript',
    })
  }

  $: highlightedCodePromise = getHighlightedCode(theme)
</script>

<div class="code">
  {#await highlightedCodePromise}
    Loading...
  {:then highlightedCode}
    {@html highlightedCode}
  {:catch}
    System error.
  {/await}
</div>

<style>
  .code {
    background: var(--view-background-primary);
    padding: 10px;
  }
</style>
