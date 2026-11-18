/** Wordmark oficial aprovado (NIMBO serifado com o M curvilíneo). Asset original vetorizado em alpha. */
export function Wordmark({ className = '', label = true }: { className?: string; label?: boolean }) {
  return (
    <img
      src="/assets/branding/nimbo-wordmark.png"
      width={900}
      height={155}
      alt={label ? 'NIMBO' : ''}
      className={`wordmark ${className}`}
      draggable={false}
    />
  )
}
