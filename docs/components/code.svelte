<script lang="ts">
  import { getHighlighter, loadTheme, setWasm } from 'shiki'

  export let theme: string
  let background: string | undefined

  let getHighlightedCode = async (colorThemeName: string): Promise<string> => {
    let wasmResponse = await fetch('/onig.wasm')
    let wasmBuffer = await wasmResponse.arrayBuffer()
    setWasm(wasmBuffer)

    let colorTheme = await loadTheme(`/themes/${colorThemeName}.json`)
    background = colorTheme.colors?.['editor.background']

    let highlighter = await getHighlighter({
      theme: colorTheme,
      langs: ['javascript'],
    })

    await highlighter.loadLanguage('javascript')

    return highlighter.codeToHtml('const a = 1', {
      lang: 'javascript',
    })
  }

  let highlightedCodePromise = getHighlightedCode(theme)
</script>

<div class="code" style="background: {background}">
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
    padding: 10px;
  }
</style>
