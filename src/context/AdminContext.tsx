'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ADMIN_PASSWORD_HASH = 'b0fcdf851a8fa5fa2b58ccb5e4633d84524a95806733557c6f68bdc4afcced27';
const SECRET_HASH = '102e012866dd7d921e6c010521251045f835ee19244b0852ee5a464ff163e418';
const SECRET_LENGTH = 7;
const SESSION_UNLOCK_KEY = 'kruthik_admin_unlocked';

async function hashString(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface AdminContextType {
  isUnlocked: boolean;
  lockAdmin: () => void;
  showPasswordModal: boolean;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isUnlocked: false,
  lockAdmin: () => {},
  showPasswordModal: false,
  openPasswordModal: () => {},
  closePasswordModal: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const keyBufferRef = useRef<{ key: string; time: number }[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_UNLOCK_KEY);
    if (stored === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPasswordModal) setShowPasswordModal(false);
        return;
      }

      if (e.key.length !== 1) return;
      const now = Date.now();
      const entry = { key: e.key.toLowerCase(), time: now };
      const recent = keyBufferRef.current.filter((k) => now - k.time < 5000);
      recent.push(entry);
      keyBufferRef.current = recent.slice(-SECRET_LENGTH);

      if (keyBufferRef.current.length === SECRET_LENGTH) {
        const typed = keyBufferRef.current.map((k) => k.key).join('');
        const hashed = await hashString(typed);
        if (hashed === SECRET_HASH) {
          keyBufferRef.current = [];
          if (!isUnlocked) {
            setShowPasswordModal(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked, showPasswordModal]);

  const lockAdmin = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem(SESSION_UNLOCK_KEY);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashed = await hashString(passwordInput);
    if (hashed === ADMIN_PASSWORD_HASH) {
      setIsUnlocked(true);
      sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isUnlocked,
        lockAdmin,
        showPasswordModal,
        openPasswordModal: () => setShowPasswordModal(true),
        closePasswordModal: () => setShowPasswordModal(false),
      }}
    >
      {children}

      {/* Persistent Session Unlock Status Pill — only shown when unlocked */}
      {isUnlocked && (
        <div
          onClick={lockAdmin}
          title="Click to lock admin controls"
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(200,150,90,0.12)',
            border: '1px solid rgba(200,150,90,0.35)',
            color: '#C8965A',
            padding: '0.45rem 1.4rem',
            borderRadius: '9999px',
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            cursor: 'pointer',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 20px rgba(200,150,90,0.15)',
          }}
        >
          🔒 Admin Mode Active · Click to Lock
        </div>
      )}

      {/* Global Password Prompt Modal */}
      {showPasswordModal && !isUnlocked && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(8,7,5,0.88)', backdropFilter: 'blur(16px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowPasswordModal(false)}
        >
          <div className="w-full max-w-sm glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-foreground">Admin Unlock</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Enter password to unlock portfolio management controls for this session.
            </p>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(''); }}
                  placeholder="Enter password"
                  autoFocus
                  className={`w-full bg-input border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors pr-10 ${
                    passwordError ? 'border-red-400/50' : 'border-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-300"
                style={{ borderRadius: '4px' }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 16px rgba(200,150,90,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                Unlock Session
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
