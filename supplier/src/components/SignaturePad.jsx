import React, { useRef, useState, useEffect } from 'react';

const SignaturePad = ({ value, onChange, disabled = false }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isExistingPreview, setIsExistingPreview] = useState(false);

  useEffect(() => {
    if (value && typeof value === 'string' && value.length > 0 && !hasDrawn) {
      setIsExistingPreview(true);
    }
  }, [value, hasDrawn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Save content if drawn
      let tempImage = null;
      if (hasDrawn) {
        tempImage = canvas.toDataURL();
      }

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;

      if (tempImage) {
        const img = new Image();
        img.src = tempImage;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
        };
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isExistingPreview, hasDrawn]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    if (disabled || isExistingPreview) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing || disabled || isExistingPreview) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    setIsDrawing(false);
    if (canvas && onChange) {
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    setIsExistingPreview(false);
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className="signature-pad-wrapper w-100">
      <div
        className="position-relative bg-white rounded-3 border"
        style={{
          minHeight: '180px',
          height: '200px',
          borderColor: '#E2E8F0',
          overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        {isExistingPreview && value ? (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 p-3 bg-light-subtle">
            <img
              src={value}
              alt="Existing Signature"
              style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }}
            />
            <span className="text-muted ct_fs_12 mt-2">Existing Saved Signature</span>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                cursor: disabled ? 'not-allowed' : 'crosshair',
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
            {!hasDrawn && !value && (
              <div
                className="position-absolute top-50 start-50 translate-middle text-muted ct_fs_14 text-center user-select-none pointer-events-none"
                style={{ opacity: 0.5, pointerEvents: 'none' }}
              >
                <i className="fa-solid fa-signature fs-3 d-block mb-1"></i>
                Sign here with mouse, finger, or stylus
              </div>
            )}
          </>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-between mt-2">
        <span className="text-muted ct_fs_12">
          <i className="fa-solid fa-lock me-1"></i>
          Legally binding digital signature
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-sm btn-outline-secondary px-3 py-1 ct_fs_13 d-flex align-items-center gap-1"
          style={{ borderRadius: '6px' }}
          disabled={disabled}
        >
          <i className="fa-solid fa-rotate-left ct_fs_11"></i>
          <span>{isExistingPreview ? 'Change / Clear Signature' : 'Clear'}</span>
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
