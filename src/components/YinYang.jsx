export default function YinYang({ size = 100, className = '', style = {}, goldRing = true }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Dark half */}
      <path
        d="M50,5 A45,45 0 0,1 50,95 A22.5,22.5 0 0,1 50,50 A22.5,22.5 0 0,0 50,5 Z"
        fill="#0D0D0B"
      />
      {/* Light half */}
      <path
        d="M50,5 A45,45 0 0,0 50,95 A22.5,22.5 0 0,0 50,50 A22.5,22.5 0 0,1 50,5 Z"
        fill="#F8F6F1"
      />
      {/* Top small dot (light in dark) */}
      <circle cx="50" cy="27.5" r="7.5" fill="#F8F6F1" />
      {/* Bottom small dot (dark in light) */}
      <circle cx="50" cy="72.5" r="7.5" fill="#0D0D0B" />
      {/* Gold ring */}
      {goldRing && (
        <circle cx="50" cy="50" r="45" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
      )}
    </svg>
  );
}
