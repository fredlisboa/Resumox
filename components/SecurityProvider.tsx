'use client'

import { useEffect } from 'react'

export default function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Desabilitar botão direito do mouse
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Desabilitar teclas de atalho comuns para inspecionar/copiar
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // F12 (DevTools)
      if (e.keyCode === 123) {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault()
        return false
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault()
        return false
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault()
        return false
      }

      // Ctrl+C em elementos protegidos
      if (e.ctrlKey && e.keyCode === 67) {
        const target = e.target as HTMLElement
        if (target.closest('.protected-content')) {
          e.preventDefault()
          return false
        }
      }
    }

    // Detectar DevTools aberto (método básico)
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold

      if (widthThreshold || heightThreshold) {
        console.clear()
        console.log('%cAtenção!', 'color: red; font-size: 40px; font-weight: bold;')
        console.log('%cO conteúdo desta área é protegido por direitos autorais.', 'color: red; font-size: 16px;')
        console.log('%cCópia ou distribuição não autorizada é proibida.', 'color: red; font-size: 16px;')
      }
    }

    // Prevenir drag de imagens e mídia
    const preventDrag = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Adicionar event listeners
    document.addEventListener('contextmenu', disableContextMenu)
    document.addEventListener('keydown', disableKeyboardShortcuts)
    document.addEventListener('dragstart', preventDrag)

    // Verificar DevTools periodicamente
    const devToolsInterval = setInterval(detectDevTools, 1000)

    // Desabilitar seleção de texto em elementos protegidos
    const style = document.createElement('style')
    style.innerHTML = `
      .protected-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }

      .protected-content video,
      .protected-content audio,
      .protected-content img {
        pointer-events: auto;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `
    document.head.appendChild(style)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu)
      document.removeEventListener('keydown', disableKeyboardShortcuts)
      document.removeEventListener('dragstart', preventDrag)
      clearInterval(devToolsInterval)
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}
