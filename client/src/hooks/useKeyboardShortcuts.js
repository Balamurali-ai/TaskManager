import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
      const modifierKey = ctrlKey || metaKey;

      shortcuts.forEach(({ keys, action, preventDefault = true }) => {
        const keyParts = keys.split('+');
        let matches = false;
        
        if (keyParts.length === 2) {
          const [modifier, mainKey] = keyParts;
          if (modifier === 'ctrl' && modifierKey && key.toLowerCase() === mainKey.toLowerCase()) {
            matches = true;
          } else if (modifier === 'shift' && shiftKey && key.toLowerCase() === mainKey.toLowerCase()) {
            matches = true;
          } else if (modifier === 'alt' && altKey && key.toLowerCase() === mainKey.toLowerCase()) {
            matches = true;
          }
        } else if (keyParts.length === 1 && key.toLowerCase() === keys.toLowerCase()) {
          matches = true;
        }
        
        if (matches) {
          if (preventDefault) {
            event.preventDefault();
          }
          action();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};