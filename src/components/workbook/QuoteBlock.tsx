interface QuoteBlockProps {
  text: string;
  author: string;
}

export function QuoteBlock({ text, author }: QuoteBlockProps) {
  return (
    <blockquote className="bg-gold/5 border-l-4 border-gold rounded-r-lg p-6 mb-8">
      <p className="text-lg font-display text-foreground italic mb-2">
        "{text}"
      </p>
      <cite className="text-sm text-muted-foreground not-italic">
        — {author}
      </cite>
    </blockquote>
  );
}
