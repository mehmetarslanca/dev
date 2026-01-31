import React from "react";

interface ContentRendererProps {
  content: string;
}

export function ContentRenderer({ content }: ContentRendererProps) {
  const processContent = (text: string) => {
    // Split by newlines first to maintain paragraph structure
    return text.split('\n').map((line, lineIndex) => {
        if (!line.trim()) return <br key={lineIndex} />;

        // Regex to match image URLs
        // Matches http/https urls ending in common image extensions
        const imageRegex = /(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s]*)?)/gi;
        const parts = line.split(imageRegex);

        return (
            <p key={lineIndex} className="mb-6 leading-relaxed text-lg lg:text-xl font-light">
                {parts.map((part, partIndex) => {
                    if (part.match(imageRegex)) {
                        return (
                            <ImagePreview key={partIndex} src={part} />
                        );
                    }
                    return <span key={partIndex}>{part}</span>;
                })}
            </p>
        );
    });
  };

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-300">
      {processContent(content)}
    </div>
  );
}

function ImagePreview({ src }: { src: string }) {
    return (
        <span className="block my-4">
             <img
                src={src}
                alt="Content"
                className="rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity max-w-full h-auto border border-white/10"
                onClick={() => window.open(src, '_blank')}
            />
        </span>
    )
}
