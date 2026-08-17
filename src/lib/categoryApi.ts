const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type Category = {
    categoryId: number;
    parentCategoryId: number | null;
    categoryName: string;
    slug: string;
    description: string | null;
    imageurl: string | null;
    displayOrder: number;
    isActive: boolean;
};

export async function getCategories(): Promise<Category[]>{
    const res = await fetch(`${API_BASE}/api/categories`);

    const data = await res.json().catch(() => []);

    if(!res.ok){
        throw new Error(data?.message ?? `Request failed: ${res.status}`);
    }

    return data;
}

export async function getProductByCategory(categoryId: number){
    const res = await fetch(`${API_BASE}/api/products/category/${categoryId}`);

    const data = await res.json().catch(() => []);

    if(!res.ok){
        throw new Error(data?.message ?? `Request failed: ${res.status}`);
    }

    return data;
}