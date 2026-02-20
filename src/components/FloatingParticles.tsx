export default function FloatingParticles({ count = 12 }: { count?: number }) {
  // lightweight placeholder to avoid heavy canvas logic — renders decorative dots
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0">
        {/* empty placeholder for particles */}
      </div>
    </div>
  );
}
