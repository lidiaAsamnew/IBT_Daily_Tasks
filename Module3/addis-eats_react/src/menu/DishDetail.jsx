import { Link, useParams } from "react-router-dom";

function DishDetail() {
  const { id } = useParams();

  return (
    <div>
      <h2>Dish details</h2>
      <p>Dish ID: {id}</p>
      <p>
        <Link to="/menu">Back to menu</Link>
      </p>
    </div>
  );
}

export default DishDetail;
