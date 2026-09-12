import Main from "./Main";
import { getMenu } from "../api/menu";
import useFetch from "../hooks/useFetch";

function Menu() {
  const { data: menu, loading, error } = useFetch(getMenu);

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <Main menu={menu} />;
}

export default Menu;
