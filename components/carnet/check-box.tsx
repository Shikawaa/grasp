export function CheckBox({ checked = false }: { checked?: boolean }) {
  return (
    <span className="carnet-checkbox" aria-hidden="true">
      {checked ? (
        <svg viewBox="0 0 24 24">
          <path d="M4 12 C 8 15, 9 18, 11 19 C 14 12, 17 7, 21 4" />
        </svg>
      ) : null}
    </span>
  );
}
