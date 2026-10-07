import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, ExternalLink, Download, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  bibNumber: string;
  registrationId: string;
  runnerName: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  bibNumber,
  registrationId,
  runnerName,
  size = 180,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    // Generate verification URL
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const verificationUrl = `${origin}/marathon/#/verifyUser?bib=${encodeURIComponent(bibNumber)}&id=${encodeURIComponent(registrationId)}&name=${encodeURIComponent(runnerName)}`;
    setQrUrl(verificationUrl);

    const qrOpts = {
      width: size,
      margin: 1,
      color: {
        dark: '#090D16', // Dark obsidian
        light: '#FFFFFF', // Clean white background for reliable mobile scanning
      },
      errorCorrectionLevel: 'H' as const,
    };

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, verificationUrl, qrOpts, (error) => {
        if (error) console.error('QR code canvas error:', error);
      });
    }

    QRCode.toDataURL(verificationUrl, qrOpts, (error, url) => {
      if (!error && url) {
        setDataUrl(url);
      }
    });
  }, [bibNumber, registrationId, runnerName, size]);

  const handleDownload = () => {
    const downloadSrc = dataUrl || (canvasRef.current ? canvasRef.current.toDataURL('image/png') : '');
    if (!downloadSrc) return;
    const link = document.createElement('a');
    link.download = `VJP_Marathon_Pass_${bibNumber}.png`;
    link.href = downloadSrc;
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* QR Code Container with High-Contrast White Background for Scanners */}
      <div className="relative p-2.5 bg-white rounded-2xl shadow-md border-2 border-amber-400">
        <canvas ref={canvasRef} className="block rounded-lg" />
        {!canvasRef.current && dataUrl && (
          <img src={dataUrl} alt="Marathon QR Pass" width={size} height={size} className="block rounded-lg" />
        )}
      </div>

      <div className="mt-2 text-center">
        <div className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1">
          <QrCode className="w-3.5 h-3.5" />
          <span>Race Day Verification Pass</span>
        </div>
        <p className="text-[10px] text-stone-400 max-w-[200px] mx-auto mt-0.5">
          Scan with any mobile camera or click below to verify.
        </p>
      </div>

      {/* Action Buttons to Test & Download */}
      <div className="flex items-center gap-2 mt-2.5">
        {/* <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold rounded-lg border border-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3 h-3 text-amber-400" />
          <span>Test Verify URL</span>
        </a> */}

        <button
          type="button"
          onClick={handleDownload}
          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold rounded-lg border border-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          {downloaded ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3 text-amber-400" />}
          <span>{downloaded ? 'Saved!' : 'Save QR'}</span>
        </button>
      </div>
    </div>
  );
};
