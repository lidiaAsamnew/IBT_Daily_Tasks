import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/app/menu/AddToCartButton";
import { etb } from "@/lib/format";

export default function DishCard({ dish }) {
  return (
    <li className="flex h-full flex-col overflow-hidden rounded-2xl border border-injera bg-white transition-shadow hover:shadow-lg">
      <Link href={`/menu/${dish.id}`} className="flex flex-1 flex-col">
        {/* width/height = the file's 4:3 shape, so the space is reserved before it loads (CLS).
            sizes = how wide the card really is: full width on a phone, half on a tablet, ~400px after that. */}
        <Image
          src={dish.image}
          alt={dish.alt}
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="h-auto w-full"
        />
        <div className="flex flex-1 flex-col gap-2 p-5 pb-0">
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-forest">{dish.category}</span>
            {dish.spicy && <span className="rounded-full bg-berbere/10 px-2.5 py-0.5 text-berbere">Spicy</span>}
          </div>
          <h3 className="text-xl font-semibold">{dish.name}</h3>
          <p className="flex-1 text-sm text-muted">{dish.description}</p>
          <p className="font-semibold text-forest">{etb(dish.price)}</p>
        </div>
      </Link>
      <div className="p-5 pt-3">
        <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price }} className="btn btn-green w-full text-sm" />
      </div>
    </li>
  );
}
