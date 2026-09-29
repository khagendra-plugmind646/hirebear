export default function BearIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Main circle */}
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      
      {/* Ears - simplified circles on top */}
      <circle cx="6" cy="5" r="3.5" fill="currentColor" />
      <circle cx="18" cy="5" r="3.5" fill="currentColor" />
      
      {/* Face - lighter oval */}
      <ellipse cx="12" cy="13" rx="6" ry="5" fill="white" />
      
      {/* Eyes - simple circles */}
      <circle cx="9" cy="11" r="1.2" fill="currentColor" />
      <circle cx="15" cy="11" r="1.2" fill="currentColor" />
      
      {/* Nose - simple oval */}
      <ellipse cx="12" cy="14" rx="2" ry="1.5" fill="currentColor" />
      
      {/* Mouth - simple curve */}
      <path d="M 10 16 Q 12 17 14 16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
