
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#1a365d] text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6984e924d86b58e63efcd1f8/4b78bcc54_image.png" 
              alt="IMGQ Logo" 
              className="h-8 w-8 object-contain"
            />
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Quineus - Instituto Médio de Gestão Quineus (IMGQ)
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm font-medium text-[#f6c344]">
              Criado por Osvaldo Da Cruz
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}