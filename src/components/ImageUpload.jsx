import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, RefreshCw } from 'lucide-react';

/**
 * ImageUpload Component
 * Replaces URL text inputs with a pure image upload experience.
 * Automatically compresses images client-side via HTML5 Canvas to keep
 * file sizes small (~30KB-70KB) and prevent LocalStorage quota overflow.
 */
export default function ImageUpload({
  label = 'Upload Image',
  value,
  onChange,
  fallbackImage = '/abes/bootcamp.webp',
  shape = 'rectangle', // 'rectangle' | 'circle'
  presets = []
}) {
  const fileInputRef = useRef(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = shape === 'circle' ? 600 : 1000;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to lightweight WebP or JPEG
          let dataUrl = canvas.toDataURL('image/webp', 0.82);
          if (!dataUrl || dataUrl.length < 50 || dataUrl.startsWith('data:,')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          }

          onChange(dataUrl);
        } catch (err) {
          console.error('Image compression error:', err);
          // Fallback to raw data url if canvas fails
          onChange(e.target.result);
        } finally {
          setIsCompressing(false);
        }
      };

      img.onerror = () => {
        alert('Could not decode the selected image file. Please try another one.');
        setIsCompressing(false);
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
      setIsCompressing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayImage = value || fallbackImage;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          fontSize: '0.85rem', 
          fontWeight: 600, 
          marginBottom: '0.4rem',
          color: 'var(--color-text-primary)'
        }}>
          {label} *
        </label>
      )}

      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Upload & Preview Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: isDragOver ? '2px dashed #8b1d24' : '2px dashed var(--color-border)',
          borderRadius: '12px',
          padding: value ? '1rem' : '1.75rem 1rem',
          background: isDragOver ? 'rgba(139, 29, 36, 0.05)' : 'var(--color-bg-elevated)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {value ? (
          /* Preview state with photo displayed */
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: shape === 'circle' ? '72px' : '110px',
              height: shape === 'circle' ? '72px' : '70px',
              borderRadius: shape === 'circle' ? '50%' : '8px',
              overflow: 'hidden',
              background: '#000',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '2px solid rgba(255,255,255,0.1)'
            }}>
              <img
                src={displayImage}
                alt="Uploaded Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>

            <div style={{ textAlign: 'left', flex: 1, minWidth: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <Check size={16} /> Photo Uploaded Successfully
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Click anywhere or drag a new image to replace.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem' }}
              >
                <RefreshCw size={13} /> Change Photo
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', color: '#dc2626' }}
                title="Remove photo"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Empty Dropzone state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(139, 29, 36, 0.1)',
              color: '#8b1d24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isCompressing ? <RefreshCw size={24} className="spinning" /> : <UploadCloud size={24} />}
            </div>

            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>
                {isCompressing ? 'Compressing & Preparing Photo...' : 'Click to Upload Photo from Device'}
              </p>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Drag and drop your image here (PNG, JPG, WebP supported)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional Preset Library quick picker */}
      {presets && presets.length > 0 && (
        <div style={{ marginTop: '0.6rem' }}>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            {showPresets ? 'Hide club photo presets' : 'Or select from club photo library'}
          </button>

          {showPresets && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {presets.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => onChange(p.url)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    border: value === p.url ? '1px solid #8b1d24' : '1px solid var(--color-border)',
                    background: value === p.url ? 'rgba(139, 29, 36, 0.12)' : 'var(--color-bg-base)',
                    color: value === p.url ? '#8b1d24' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontWeight: value === p.url ? 600 : 400
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
