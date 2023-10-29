<script lang="ts">
  type Option = {
    label: string
    value: string
  }

  export let options: Option[] = []

  export let value = options[0].value

  let getLabel = (value: string) => {
    let option = options.find(option => option.value === value)
    return option!.label
  }
  let valueToShow = getLabel(value)
  let ref: HTMLInputElement
  let show = false

  let selectValue = (newValue?: string) => {
    if (newValue) {
      value = newValue
      valueToShow = getLabel(newValue)
    } else {
      valueToShow = getLabel(value)
    }
    show = false
    ref.blur()
  }

  let onEnterPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      let option = optionsToShow[0]
      selectValue(option.value)
      show = false
    }
  }

  let handleFocus = () => {
    valueToShow = ''
    show = true
    window.addEventListener('keydown', onEnterPress)
  }

  let handleBlur = () => {
    selectValue()
    window.removeEventListener('keydown', onEnterPress)
  }

  let handleClick = (event: MouseEvent, option: Option) => {
    selectValue(option.value)
  }

  $: optionsToShow = options.filter(option =>
    option.label.toLowerCase().includes(valueToShow.toLowerCase()),
  )
</script>

<div class="wrapper">
  <input
    bind:value={valueToShow}
    on:focus={handleFocus}
    on:blur={handleBlur}
    bind:this={ref}
    class="input"
    type="text"
  />
  {#if show}
    <div class="options">
      <ul class="list">
        {#each optionsToShow as option}
          <li class="item">
            <button
              class="button"
              on:mousedown={event => {
                handleClick(event, option)
              }}
            >
              {@html option.label.replace(
                new RegExp(valueToShow, 'gi'),
                match => `<b>${match}</b>`,
              )}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
  }

  .input {
    inline-size: 100%;
    padding: 8px 16px;
    font-size: 12px;
    border: 1px solid var(--view-border);
    color: var(--view-color-primary);
    background: var(--view-background-primary);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 300ms;
    outline: none;
  }

  .input:hover,
  .input:focus-visible {
    border-color: var(--view-border-active);
  }

  .options {
    position: absolute;
    max-block-size: 200px;
    inline-size: 100%;
    background: #fff;
    border: 1px solid var(--view-border);
    border-radius: 8px;
    overflow: hidden;
    z-index: 1;
    margin-block-start: 4px;
    transform: scaleY(0);
    transform-origin: top center;
    animation: grow-down 250ms ease-in-out forwards;
  }

  .list {
    margin-block: 0;
    padding-inline-start: 0;
    list-style-type: none;
  }

  .item {
    font-size: 12px;
    overflow: hidden;
  }

  .button {
    background: var(--view-background-primary);
    color: var(--view-color-primary);
    inline-size: 100%;
    block-size: 100%;
    padding: 8px 12px;
    border: 0;
    text-align: start;
  }

  .button:hover,
  .button:focus-visible {
    background: var(--view-background-secondary);
  }

  @keyframes grow-down {
    0% {
      transform: scaleY(0);
    }

    80% {
      transform: scaleY(1.1);
    }

    100% {
      transform: scaleY(1);
    }
  }
</style>
