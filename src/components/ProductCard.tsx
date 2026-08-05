"use client";

import Image from "next/image";
import { Eye, Heart, Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/data";
import { useApp } from "./AppContext";

export function ProductCard({ product }: { product: Product }) {
  const { bag, saved, addToBag, toggleSaved, setQuickView } = useApp();
  const inBag = bag.some((item) => item.id === product.id);
  const isSaved = saved.includes(product.id);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-[#E9E3EE] bg-white transition duration-300 hover:-translate-y-1.5 hover:border-[#CDBAF1] hover:shadow-[0_24px_60px_rgba(46,5,105,.10)]">
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-5 transition duration-700 group-hover:scale-[1.03]"
        />

        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] ${product.status === "Featured" ? "bg-[#2E0569] text-white" : product.status === "New" ? "bg-[#EAF4E4] text-[#315C20]" : "bg-[#FFF1DA] text-[#9A5D0A]"}`}>{product.status}</span>
        <button onClick={() => toggleSaved(product.id)} aria-label={isSaved ? `Remove ${product.name} from saved products` : `Save ${product.name}`} className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border transition ${isSaved ? "border-[#8C52FF] bg-[#8C52FF] text-white" : "border-[#E9E3EE] bg-white text-[#2E0569] hover:text-[#8C52FF]"}`}><Heart size={17} fill={isSaved ? "currentColor" : "none"} /></button>
        <button onClick={() => setQuickView(product)} className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#2E0569] px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[.12em] text-white shadow-lg transition opacity-0 group-hover:opacity-100"><Eye size={14} />Quick view</button>
      </div>

      <div className="flex flex-1 flex-col border-t border-[#E9E3EE] p-5">
        <div className="flex items-center justify-between gap-3 text-[9px] font-extrabold uppercase tracking-[.13em]"><span className="text-[#8C52FF]">{product.range}</span><span className="text-[#8B8292]">{product.format}</span></div>
        <h3 className="mt-3 text-[20px] font-extrabold leading-tight tracking-[-.03em] text-[#2E0569]">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-[11.5px] leading-[1.7] text-[#716A78]">{product.descriptor}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">{product.goals.slice(0, 2).map((goal) => <span key={goal} className="rounded-full border border-[#E9E3EE] px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[.1em] text-[#6D5A7C]">{goal}</span>)}</div>
        <div className="mt-auto pt-5"><button onClick={() => addToBag(product)} className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-[11px] font-extrabold transition ${inBag ? "bg-[#EAF4E4] text-[#315C20]" : "bg-[#8C52FF] text-white hover:bg-[#2E0569]"}`}>{inBag ? <><ShoppingBag size={15} />Saved to wellness bag</> : <><Plus size={15} />Add to wellness bag</>}</button></div>
      </div>
    </article>
  );
}
