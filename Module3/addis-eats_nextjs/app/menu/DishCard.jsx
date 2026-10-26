import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { etb } from "@/lib/format";

// Presentational: plain markup from data. It is used by the server-rendered list AND by the client-side
// search results, so it carries no directive of its own (see BOUNDARY.md).
// The whole card is clickable through the title link's ::after; the Add button sits above it.
export default function DishCard({ dish, priority = false }) {
  return (
    <article className="dish-card">
      <div className="dish-media">
        <Image
          src={dish.image}
          alt={dish.alt ?? dish.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 340px"
          priority={priority}
          className="dish-img"
        />
        <span className="chip dish-chip">{dish.category}</span>
        {dish.spicy && <span className="chip chip-spicy dish-chip dish-chip--right">Spicy</span>}
      </div>
      <div className="dish-body">
        <h3 className="dish-title">
          <Link href={`/menu/${dish.id}`} className="dish-link">{dish.name}</Link>
        </h3>
        <p className="dish-desc">{dish.description}</p>
        <div className="dish-foot">
          <p className="price">{etb(dish.price)}</p>
          <AddToCartButton dish={dish} />
        </div>
      </div>
    </article>
  );
}
