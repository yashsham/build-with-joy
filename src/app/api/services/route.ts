import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db/client";
import { categories, services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);
    const allServices = await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.sortOrder);

    // Group services by category
    const categoriesWithServices = allCategories.map((cat) => {
      return {
        ...cat,
        services: allServices.filter((svc) => svc.categoryId === cat.id),
      };
    });

    return NextResponse.json(categoriesWithServices);
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
