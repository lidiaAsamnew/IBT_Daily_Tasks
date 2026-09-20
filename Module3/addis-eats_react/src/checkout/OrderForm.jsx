import { useState } from "react";

function OrderForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "Summit",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    alert(`Order submitted for ${form.name} in ${form.area}`);
  }

  return (
    <div className="form-card">
      <h2>Customer Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="order-name">Name: </label>
          <input
            id="order-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Your Name"
          />
        </div>
        <div className="field">
          <label htmlFor="order-phone">Phone: </label>
          <input
            id="order-phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="text"
            placeholder="Your Phone No"
          />
        </div>
        <div className="field">
          <label htmlFor="order-area">Area: </label>
          <select
            id="order-area"
            name="area"
            value={form.area}
            onChange={handleChange}
          >
            <option value="Summit">Summit</option>
            <option value="Akaki">Akaki</option>
            <option value="Bole">Bole</option>
            <option value="Gullele">Gullele</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default OrderForm;
