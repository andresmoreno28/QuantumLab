import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import Sass from 'sass.js/dist/sass.sync.js';

interface LivePreviewProps {
  html: string;
  styles: string;
  javascript: string;
  isScss: boolean;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  html,
  styles,
  javascript,
  isScss,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const updatePreview = () => {
      if (iframeRef.current) {
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          const compiledCss = isScss ? sass.compileString(styles).css : styles;
          const sanitizedHtml = DOMPurify.sanitize(html);
          const content = `
            <!DOCTYPE html>
            <html>
              <head>
                <style>${compiledCss}</style>
              </head>
              <body>
                ${sanitizedHtml}
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                <script>${javascript}</script>
              </body>
            </html>
          `;
          iframeDoc.open();
          iframeDoc.write(content);
          iframeDoc.close();
        }
      }
    };

    const timeoutId = setTimeout(updatePreview, 300);
    return () => clearTimeout(timeoutId);
  }, [html, styles, javascript, isScss]);

  return (
    <div className="border rounded-md overflow-hidden">
      <iframe
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-96"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default LivePreview;
