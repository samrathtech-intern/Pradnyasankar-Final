"use client";

import { Heart, Home, Search, ShoppingBag, Store } from "lucide-react";
import { useApp } from "./AppContext";

export function MobileBottomNav() {
  const { bag, saved, setSearchOpen, setBagOpen, setSavedOpen } = useApp();
  return <nav className="fixed inset-x-0 bottom-0 z-[55] border-t border-[#E9E3EE] bg-white/95 px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_35px_rgba(46,5,105,.1)] backdrop-blur lg:hidden" aria-label="Mobile bottom navigation"><div className="mx-auto grid max-w-lg grid-cols-5"><a className="mobile-nav-item text-[#8C52FF]" href="/"><Home size={19}/><span>Home</span></a><a className="mobile-nav-item" href="/shop"><Store size={19}/><span>Shop</span></a><button className="mobile-nav-item" onClick={()=>setSearchOpen(true)}><Search size={19}/><span>Search</span></button><button className="mobile-nav-item relative" onClick={()=>setSavedOpen(true)}><Heart size={19}/><span>Saved</span>{saved.length>0&&<i className="mobile-count">{saved.length}</i>}</button><button className="mobile-nav-item relative" onClick={()=>setBagOpen(true)}><ShoppingBag size={19}/><span>Bag</span>{bag.length>0&&<i className="mobile-count">{bag.length}</i>}</button></div></nav>;
}
