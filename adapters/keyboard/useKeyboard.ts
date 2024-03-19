import type { IKeyboardKey } from '~/core/memo/types'

export const useKeyboard = () => {
  const pressedKey = ref<IKeyboardKey>()
  const pressedKeys = ref<IKeyboardKey[]>([])
  const isPressed = ref(false)

  const unpressKey = () => (isPressed.value = false)

  const hotkey = (event: KeyboardEvent) => {
    const { code, ctrlKey, shiftKey, altKey } = event

    if (ctrlKey || shiftKey) {
      // event.preventDefault() // Prevent the default browser behavior
    }

    pressedKey.value = {
      code,
      ctrlKey,
      shiftKey,
      altKey,
    }

    if (isPressed.value)
      pressedKeys.value[pressedKeys.value.length - 1] = pressedKey.value
    else pressedKeys.value.push(pressedKey.value)

    isPressed.value = true
  }

  onMounted(() => {
    window.addEventListener('keydown', hotkey)
    window.addEventListener('keyup', unpressKey)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', hotkey)
    window.removeEventListener('keyup', unpressKey)
  })

  return { pressedKey, pressedKeys }
}
