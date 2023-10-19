<script lang="ts">
  import Code from './code.svelte'
</script>

<div class="view">
  <div class="icons">Hello</div>
  <Code theme="gruvbox-dark" />
</div>

<style>
  .view {
    display: grid;
    grid-template-columns: 1fr 400px;
    block-size: 100%;
  }

  .icons {
    padding: 10px;
  }
</style>
