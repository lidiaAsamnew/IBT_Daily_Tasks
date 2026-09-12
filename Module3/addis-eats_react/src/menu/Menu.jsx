import { useState, useEffect } from "react";
import Main from "./Main";
import { getMenu } from "../api/menu";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getMenu()
      .then((items) => {
        if (ignore) {
          return;
        }
        setMenu(items);
        setLoading(false);
      })
      .catch(() => {
        if (ignore) {
          return;
        }
        setError("Could not load the menu. Please try again.");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <Main menu={menu} />;
}

export default Menu;
