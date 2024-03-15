import type { IKeyboardKey } from '~/core/memo/types'

export const useKeyboard = () => {
  const pressedKey = ref<IKeyboardKey>()
  const pressedKeys = ref<IKeyboardKey[]>([])
  const isPressed = ref(false)

  const hotkey = (event: KeyboardEvent) => {
    const { code, ctrlKey, shiftKey, altKey } = event

    if (ctrlKey || shiftKey) {
      // event.preventDefault() // Prevent the default browser behavior
    }

    if (isPressed.value) return

    pressedKey.value = {
      code,
      ctrlKey,
      shiftKey,
      altKey,
    }

    pressedKeys.value.push(pressedKey.value)
  }

  onMounted(() => window.addEventListener('keydown', hotkey))
  onBeforeUnmount(() => window.removeEventListener('keydown', hotkey))

  return { pressedKey, pressedKeys }
}
