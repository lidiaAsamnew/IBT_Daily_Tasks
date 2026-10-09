import React from "react";
import Card from "./Card";

function Footer() {
  return (
    <div className="footer">
      <p>Ephrem Tesfaye</p>
      <Card>
        <p>Contact: ABC</p>
        <p>Phone: 123-456-7890</p>
      </Card>

      <Card>
        <h6>Address: XYZ Street, City</h6>
      </Card>
    </div>
  );
}

export default Footer;
