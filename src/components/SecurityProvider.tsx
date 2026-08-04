'use client';

import { useEffect } from 'react';

export default function SecurityProvider() {
  useEffect(() => {
    // ── 1. Disable right-click context menu ──────────────────────────────────
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // ── 2. Block DevTools keyboard shortcuts ─────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      const isDevToolsShortcut =
        e.key === 'F12' ||
        // Ctrl+Shift+I / J / C / K (Chrome DevTools / Console / Inspector)
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c', 'k', 'I', 'J', 'C', 'K'].includes(e.key)) ||
        // Ctrl+U (View Source)
        (e.ctrlKey && ['u', 'U'].includes(e.key)) ||
        // Ctrl+S (Save page)
        (e.ctrlKey && !e.shiftKey && !e.altKey && ['s', 'S'].includes(e.key)) ||
        // Mac: Cmd+Option+I / J
        (e.metaKey && e.altKey && ['i', 'I', 'j', 'J'].includes(e.key));

      if (isDevToolsShortcut) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);

    // ── 3. Console warning & periodic clear ──────────────────────────────────
    const printWarning = () => {
      console.clear();
      console.log(
        '%c🔒',
        'font-size: 48px;'
      );
      console.log(
        '%cAccess Restricted',
        'color: #C8965A; font-size: 22px; font-weight: 700; letter-spacing: 2px;'
      );
      console.log(
        '%cThis portfolio belongs to Balusu Kruthik.\nUnauthorized reproduction or code copying is prohibited.',
        'color: #7A7570; font-size: 13px; line-height: 1.6;'
      );
    };
    printWarning();
    const consoleInterval = setInterval(printWarning, 4000);

    // ── 4. Detect DevTools via debugger timing ────────────────────────────────
    let devtoolsOpen = false;
    const devtoolsCheck = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          document.body.style.filter = 'blur(8px)';
          document.body.style.pointerEvents = 'none';
        }
      } else {
        if (devtoolsOpen) {
          devtoolsOpen = false;
          document.body.style.filter = '';
          document.body.style.pointerEvents = '';
        }
      }
    };
    const devtoolsInterval = setInterval(devtoolsCheck, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
      clearInterval(consoleInterval);
      clearInterval(devtoolsInterval);
    };
  }, []);

  return null;
}
