export default function WhiteFadeTransition({ active }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#ffffff',
        pointerEvents: 'none',
        zIndex: 50,
        opacity: active ? 1 : 0,
        transition: active
          ? 'opacity 0.35s ease-in'
          : 'opacity 0.5s ease-out',
      }}
    />
  )
}