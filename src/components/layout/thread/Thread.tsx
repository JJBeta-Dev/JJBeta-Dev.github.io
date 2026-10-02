/**
 * Capa SVG del hilo punteado y de la flecha que lo recorre. `useThread` mide y anima los trazados; cada
 * trazado se revela a través de una máscara para que los guiones se dibujen solos.
 *
 * @returns {import('react').JSX.Element} Los SVG del hilo y de la flecha.
 * @example
 * <Thread />
 */
export default function Thread() {
  return (
    <>
      <svg className="thread" aria-hidden="true">
        <defs>
          <mask id="thread-mask-a">
            <path
              className="thread-mask-a"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
          </mask>
          <mask id="thread-mask-b">
            <path
              className="thread-mask-b"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
          </mask>
        </defs>
        <path className="thread-a" mask="url(#thread-mask-a)" strokeDasharray="22 18" />
        <path className="thread-b" mask="url(#thread-mask-b)" strokeDasharray="22 18" />
      </svg>
      <svg className="rider" viewBox="0 0 40 44" aria-hidden="true">
        <path d="M4 3l30 16-13 3-6 13z" />
      </svg>
    </>
  )
}
