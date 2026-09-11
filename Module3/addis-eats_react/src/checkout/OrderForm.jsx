import React, { useState } from "react";

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
    // VALIDATE PHONE NUMBER
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    console.log(form);
    alert(`Order submitted for ${form.name} in ${form.area}`);
  }

  return (
    <div>
      <h2>Customer Information</h2>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Your Name"
        />
        <br></br>
        <label>Phone: </label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          type="text"
          placeholder="Your Phone No"
        />
        <br></br>
        <label>Area: </label>
        <select name="area" value={form.area} onChange={handleChange}>
          <option value="Summit">Summit</option>
          <option value="Akaki">Akaki</option>
          <option value="Bole">Bole</option>\
          <option value="Gullele">Gullele</option>
        </select>
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default OrderForm;
