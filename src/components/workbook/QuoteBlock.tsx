interface QuoteBlockProps {
  text: string;
  author: string;
}

export function QuoteBlock({ text, author }: QuoteBlockProps) {
  return (
    <div className="relative my-8 px-6 py-5 bg-gold/5 border-l-4 border-gold rounded-r-lg">
      <svg 
        className="absolute top-4 left-4 w-8 h-8 text-gold/20"
        fill="currentColor"
        viewBox="0 0 32 32"
      >
        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/>
      </svg>
      <p className="font-display text-lg italic text-foreground pl-8">
        "{text}"
      </p>
      <p className="mt-3 text-sm text-gold font-medium pl-8">
        — {author}
      </p>
    </div>
  );
}
