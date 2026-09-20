import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../cart/cart-context";

const areas = ["Summit", "Akaki", "Bole", "Gullele"];

function Checkout() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    area: "",
    address: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  }

  function getErrors() {
    const nextErrors = {
      name: "",
      phone: "",
      area: "",
      address: "",
    };

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      nextErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    if (!form.area) {
      nextErrors.area = "Please select a delivery area.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Please enter a delivery address.";
    }

    return nextErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    const nextErrors = getErrors();
    const isInvalid = Object.values(nextErrors).some((message) => message);

    if (isInvalid) {
      setErrors(nextErrors);
      return;
    }

    setSubmitted(true);
    clearCart();
  }

  if (submitted) {
    return (
      <div>
        <h2>Order placed</h2>
        <p role="status">
          Thank you, {form.name}. Your order is on the way to {form.area}.
        </p>
        <p>
          <Link to="/menu">Back to menu</Link>
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h2>Checkout</h2>
        <p role="status">Your cart is empty, so you cannot place an order yet.</p>
        <p>
          <Link to="/menu">Browse the menu</Link>
        </p>
        <p>
          <Link to="/cart">Back to cart</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Checkout</h2>

      <div>
        <h3>Order summary</h3>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} — {item.price * item.quantity} ETB
            </li>
          ))}
        </ul>
        <p>Total : {total} ETB</p>
      </div>

      <h3>Delivery details</h3>
      <form onSubmit={handleSubmit} noValidate>
        <p>
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </p>
        {errors.name && (
          <p id="name-error" role="alert">
            {errors.name}
          </p>
        )}

        <p>
          <label htmlFor="phone">Phone: </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
        </p>
        {errors.phone && (
          <p id="phone-error" role="alert">
            {errors.phone}
          </p>
        )}

        <p>
          <label htmlFor="area">Delivery area: </label>
          <select
            id="area"
            name="area"
            value={form.area}
            onChange={handleChange}
            aria-invalid={Boolean(errors.area)}
            aria-describedby={errors.area ? "area-error" : undefined}
          >
            <option value="">Select an area</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </p>
        {errors.area && (
          <p id="area-error" role="alert">
            {errors.area}
          </p>
        )}

        <p>
          <label htmlFor="address">Delivery address: </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, building, or landmark"
            autoComplete="street-address"
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? "address-error" : undefined}
          />
        </p>
        {errors.address && (
          <p id="address-error" role="alert">
            {errors.address}
          </p>
        )}

        <button type="submit">Place order</button>
      </form>

      <p>
        <Link to="/cart">Back to cart</Link>
      </p>
    </div>
  );
}

export default Checkout;
