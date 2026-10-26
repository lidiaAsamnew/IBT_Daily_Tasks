import { MAX_QUANTITY } from "@/lib/constants";

// Real buttons (Day 48): focusable, keyboard-operable, 44px touch targets (see .stepper-btn).
export default function Stepper({ name, quantity, onChange, max = MAX_QUANTITY }) {
  return (
    <div className="stepper" role="group" aria-label={`Quantity of ${name}`}>
      <button type="button" className="stepper-btn" onClick={() => onChange(quantity - 1)} aria-label={`Remove one ${name}`}>
        <span aria-hidden="true">−</span>
      </button>
      <output className="stepper-value" aria-live="polite">{quantity}</output>
      <button
        type="button"
        className="stepper-btn"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        aria-label={`Add one ${name}`}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
