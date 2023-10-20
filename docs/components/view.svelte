<script lang="ts">
  import Select from 'svelte-select'

  import { themes } from '../../data/themes'
  import Code from './code.svelte'

  let items = themes.map(theme => ({
    label: theme.name,
    value: theme.id,
  }))

  let selectedTheme = items[0]

  console.log(selectedTheme)
</script>

<div class="view">
  <div class="icons">
    <Select
      {items}
      bind:value={selectedTheme}
      clearable={false}
      --item-is-active-bg="var(--view-tab-active-background)"
      --item-is-active-color="var(--view-tab-active-color)"
      --item-hover-bg="var(--view-tab-active-background)"
      --item-hover-color="var(--view-tab-active-color)"
      --border-focused="1px solid var(--view-border)"
      --list-background="var(--view-tab-background)"
      --list-border="1px solid var(--view-border)"
      --border-hover="1px solid var(--view-color)"
      --border="1px solid var(--view-border)"
      --background="var(--view-background)"
      --list-color="var(--view-tab-color)"
      --value-container-padding="0"
      --font-family="inherit"
      --font-size="12px"
      --height="32px"
    />
  </div>
  <Code bind:theme={selectedTheme.value} />
</div>

<style>
  .view {
    display: grid;
    grid-template-columns: 1fr 400px;
    block-size: 100%;
  }

  .icons {
    background: var(--view-background);
    color: var(--view-color);
    padding: 10px;
    border-inline-end: 1px solid var(--view-border);
  }
</style>
