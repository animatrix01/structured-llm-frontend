type LogoProps = {
  className?: string;
  title?: string;
};

/**
 * Wordmark-free brand mark: a pair of braces enclosing a validation check.
 * Flat, geometric, monochrome-safe and legible down to 16px.
 */
export function Logo({ className = "size-6", title }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <g
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        className="text-primary"
      >
        <path d="M12 7H7v18h5" />
        <path d="M20 7h5v18h-5" />
      </g>
      <path
        d="m12.6 16.6 2.6 2.6 4.4-5.6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        className="text-foreground"
      />
    </svg>
  );
}
