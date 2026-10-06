export function LogoMark({ className = '' }: { className?: string }) {
  return <img className={`logo-mark ${className}`} src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width="48" height="48" />;
}
