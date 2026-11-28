export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className ? `logo-mark ${className}` : 'logo-mark'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width="48"
      height="48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d="M30 18H98V36H48V51H30V18Z" />
      <path fill="#D94432" d="M16 58H88L76 70H16V58Z" />
      <path fill="#D94432" d="M94 58H112L100 70H82L94 58Z" />
      <path fill="currentColor" d="M30 77H48V92H98V110H30V77Z" />
    </svg>
  );
}

export function BrandWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={className ? `errata-brand ${className}` : 'errata-brand'} aria-label="Errata">
      <svg
        className="logo-e"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="16 18 96 92"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path fill="currentColor" d="M30 18H98V36H48V51H30V18Z" />
        <path fill="var(--errata-accent, var(--vermilion, #D94432))" d="M16 58H88L76 70H16V58Z" />
        <path fill="var(--errata-accent, var(--vermilion, #D94432))" d="M94 58H112L100 70H82L94 58Z" />
        <path fill="currentColor" d="M30 77H48V92H98V110H30V77Z" />
      </svg>
      <span aria-hidden="true">rrata</span>
    </span>
  );
}
