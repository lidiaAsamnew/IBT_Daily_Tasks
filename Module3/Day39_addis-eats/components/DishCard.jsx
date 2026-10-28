import Link from "next/link";
import DishArt from "./DishArt";
import AddToCartButton from "@/app/menu/AddToCartButton";

export default function DishCard({ dish }) {
  return (
    <li className="flex h-full flex-col overflow-hidden rounded-2xl border border-injera bg-white transition-shadow hover:shadow-lg">
      <Link href={`/menu/${dish.id}`} className="flex flex-1 flex-col">
        <div className="bg-injera/50 p-6">
          <DishArt palette={dish.palette} className="mx-auto h-36 w-36" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5 pb-0">
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-forest">{dish.category}</span>
            {dish.spicy && <span className="rounded-full bg-berbere/10 px-2.5 py-0.5 text-berbere">Spicy</span>}
          </div>
          <h3 className="text-xl font-semibold">{dish.name}</h3>
          <p className="flex-1 text-sm text-muted">{dish.description}</p>
          <p className="font-semibold text-forest">ETB {dish.price}</p>
        </div>
      </Link>
      <div className="p-5 pt-3">
        <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price }} className="btn btn-green w-full text-sm" />
      </div>
    </li>
  );
}
