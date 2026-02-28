import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className={cn(
              "rounded-xl shadow-xl w-full max-w-lg pointer-events-auto flex flex-col max-h-[90vh]",
              isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white',
              className
            )}>
              <div className={cn("flex items-center justify-between p-4 sm:p-6 border-b", isDark ? 'border-slate-800' : 'border-gray-100')}>
                <h2 className={cn("text-lg font-semibold", isDark ? 'text-slate-100' : 'text-gray-900')}>{title}</h2>
                <button
                  onClick={onClose}
                  className={cn("transition-colors rounded-lg p-1", isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-gray-400 hover:text-gray-500')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
