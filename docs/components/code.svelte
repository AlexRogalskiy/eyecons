<script lang="ts">
  import { getHighlighter, loadTheme, setWasm } from 'shiki'
  import { themes } from '../../data/themes'

  export let theme: (typeof themes)[number]['id']

  let updateCSS = (colors: Record<string, string>) => {
    let root = document.documentElement
    let set = (key: string, value: string) => {
      root.style.setProperty(key, value)
    }
    set('--view-background', colors['editor.background'])
    set('--view-color', colors['editor.foreground'])
    set(
      '--view-border',
      !colors['tab.border'].startsWith(colors['editor.background'])
        ? colors['tab.border']
        : colors['editorGroup.border'],
    )
    set(
      '--view-tab-active-background',
      !colors['tab.activeBackground'].startsWith(colors['editor.background'])
        ? colors['tab.activeBackground']
        : colors['tab.inactiveBackground'],
    )
    set(
      '--view-tab-background',
      !colors['tab.activeBackground'].startsWith(colors['editor.background'])
        ? colors['tab.inactiveBackground']
        : colors['tab.activeBackground'],
    )
    set('--view-tab-active-color', colors['tab.activeForeground'])
    set('--view-tab-color', colors['tab.inactiveForeground'])
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
    background: var(--view-background);
    padding: 10px;
  }
</style>
