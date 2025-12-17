import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  altText?: string;
}

export default function ImageViewerModal({
  isOpen,
  imageUrl,
  onClose,
  altText = 'Imagem ampliada',
}: ImageViewerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Version */}
      <div className="fixed inset-0 z-[60] md:hidden flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-90"
          onClick={onClose}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10 shadow-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-gray-900" />
        </button>

        {/* Image Container Mobile */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-[90vw] max-h-[85vh] flex items-center justify-center">
            <img
              src={imageUrl}
              alt={altText}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      {/* Desktop Version - Optimized for Landscape Images */}
      <div className="fixed inset-0 z-[60] hidden md:flex items-center justify-center px-8 py-6">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-95"
          onClick={onClose}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white rounded-full hover:bg-gray-100 transition-all hover:scale-105 z-10 shadow-2xl"
          aria-label="Fechar"
        >
          <X className="w-6 h-6 text-gray-900" />
        </button>

        {/* Image Container Desktop - Landscape Optimized */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-[95vw] max-w-[1600px] h-[88vh] flex items-center justify-center">
            <img
              src={imageUrl}
              alt={altText}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
              style={{ maxHeight: '88vh', maxWidth: '95vw' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </>
  );
}
