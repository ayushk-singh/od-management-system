"use client";

import React from "react";

export default function DataFetchLoader() {
  return (
    <>
      {/* Full screen overlay with blur */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center p-6 bg-background rounded-lg shadow-lg max-w-xs w-full mx-4">
          <h1 className="mb-6 text-lg font-bold text-muted-foreground text-center">
            Fetching Data
          </h1>
          <div className="flex space-x-3">
            <span className="dot bounce bg-primary" />
            <span className="dot bounce delay-150 bg-primary" />
            <span className="dot bounce delay-300 bg-primary" />
          </div>
        </div>
      </div>

      {/* Styles for bouncing dots */}
      <style jsx>{`
        .dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: inline-block;
        }
        .bounce {
          animation: bounce 1.2s infinite ease-in-out;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: translateY(-12px);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
