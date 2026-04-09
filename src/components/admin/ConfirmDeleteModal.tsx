'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({ open, onClose, onConfirm, title, isLoading }: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white border border-warm-border rounded-2xl shadow-card-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-400 hover:bg-warm hover:text-ink transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={17} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-ink mb-1">Delete Listing?</h3>
            <p className="text-ink-500 text-sm leading-relaxed">
              Are you sure you want to delete <span className="text-ink font-medium">&ldquo;{title}&rdquo;</span>?
              This will permanently remove the listing and all uploaded images.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-outline text-sm px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {isLoading ? <><Spinner size="sm" /> Deleting…</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
