import { db } from "../src/lib/db/client";
import { categories, services, cities, promoCodes, users, bookings, addresses, reviews, bookingItems, professionals } from "../src/lib/db/schema";
import fs from "node:fs";
import path from "node:path";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clear existing data in correct dependency order
  await db.delete(reviews);
  await db.delete(bookingItems);
  await db.delete(bookings);
  await db.delete(addresses);
  await db.delete(professionals);
  await db.delete(users);
  await db.delete(services);
  await db.delete(categories);
  await db.delete(cities);
  await db.delete(promoCodes);

  console.log("🧹 Cleared existing tables.");

  // 2. Insert Cities
  const seededCities = [
    { name: "Bareilly", slug: "bareilly", state: "Uttar Pradesh", isActive: true },
  ];

  for (const city of seededCities) {
    await db.insert(cities).values(city);
  }
  console.log("🏙️ Seeded cities.");

  // 3. Insert Promo Codes
  const seededPromos = [
    { code: "HERMOSAGLOW", discountType: "percentage" as const, discountValue: 20, minOrderValue: 999, isActive: true },
    { code: "FIRST500", discountType: "fixed" as const, discountValue: 150, minOrderValue: 499, isActive: true },
    { code: "LUXELIFE", discountType: "percentage" as const, discountValue: 15, minOrderValue: 1500, isActive: true },
  ];

  for (const promo of seededPromos) {
    await db.insert(promoCodes).values(promo);
  }
  console.log("🎟️ Seeded promo codes.");

  // 4. Insert Categories
  const catData = [
    { name: "Female Salon", slug: "female-salon", description: "Threading, cleanup, waxing & hair services at home.", gender: "female" as const, sortOrder: 1 },
    { name: "Spa & Massage", slug: "spa-massage", description: "Aromatic, deep-tissue & relaxation therapies.", gender: "unisex" as const, sortOrder: 2 },
    { name: "Waxing Services", slug: "waxing", description: "Rica, honey & chocolate waxing. Painless & professional.", gender: "female" as const, sortOrder: 3 },
    { name: "Facial & Cleanup", slug: "facial-cleanup", description: "O3+, Lotus, Cheryl's and premium brand facials.", gender: "female" as const, sortOrder: 4 },
    { name: "Bridal Studio & Makeup", slug: "bridal", description: "Engagement to reception — your full glam squad at home.", gender: "female" as const, sortOrder: 5 },
    { name: "Mehendi Artistry", slug: "mehendi", description: "Bridal, arabic & party mehendi designs by masters.", gender: "female" as const, sortOrder: 6 },
    { name: "Male Grooming", slug: "male-grooming", description: "Haircuts, beard styling, facials & massage for men.", gender: "male" as const, sortOrder: 7 },
    { name: "Hair Care & Styling", slug: "hair", description: "Smoothening, keratin, hair spa & premium cuts.", gender: "unisex" as const, sortOrder: 8 },
    { name: "HydraGlo Facials", slug: "hydraglo", description: "Advanced medical-grade skin hydration & deep cleansing.", gender: "unisex" as const, sortOrder: 9 },
    { name: "Laser Hair Reduction", slug: "laser", description: "Painless US-FDA approved laser treatments for smooth skin.", gender: "unisex" as const, sortOrder: 10 },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of catData) {
    const res = await db.insert(categories).values(cat).returning();
    if (res[0]) {
      categoryMap[cat.slug] = res[0].id;
    }
  }
  console.log("🗂️ Seeded categories.");

  // 5. Insert Services (Totaling 50+ services)
  const servicesData = [
    // Female Salon
    { name: "Premium Honey Full Arms + Half Legs Waxing", slug: "premium-honey-wax-arms-legs", duration: 45, price: 399, discountPrice: 299, categoryId: categoryMap["female-salon"], gender: "female" as const },
    { name: "O3+ Glow Facial", slug: "o3-glow-facial", duration: 60, price: 2199, discountPrice: 1899, categoryId: categoryMap["female-salon"], gender: "female" as const, isFeatured: true },
    { name: "Threading (Eyebrows + Upper Lip)", slug: "threading-eyebrow-upperlip", duration: 15, price: 99, discountPrice: 59, categoryId: categoryMap["female-salon"], gender: "female" as const },
    { name: "L'Oreal Hair Spa Treatment", slug: "loreal-hair-spa", duration: 50, price: 1199, discountPrice: 899, categoryId: categoryMap["female-salon"], gender: "female" as const },
    { name: "Pedicure & Manicure Classic Combo", slug: "pedi-mani-classic", duration: 60, price: 999, discountPrice: 799, categoryId: categoryMap["female-salon"], gender: "female" as const },
    { name: "Premium D-Tan Pack (Face & Neck)", slug: "premium-dtan-face-neck", duration: 25, price: 499, discountPrice: 349, categoryId: categoryMap["female-salon"], gender: "female" as const },

    // Spa & Massage
    { name: "Aroma Therapy Full Body Massage", slug: "aroma-therapy-body-massage", duration: 75, price: 1799, discountPrice: 1499, categoryId: categoryMap["spa-massage"], gender: "unisex" as const, isFeatured: true },
    { name: "Deep Tissue Stress Relief Massage", slug: "deep-tissue-stress-relief", duration: 90, price: 2299, discountPrice: 1899, categoryId: categoryMap["spa-massage"], gender: "unisex" as const },
    { name: "Swedish Back & Shoulder Massage", slug: "swedish-back-shoulder-massage", duration: 45, price: 999, discountPrice: 799, categoryId: categoryMap["spa-massage"], gender: "unisex" as const },
    { name: "Pain Relief Ayurvedic Massage", slug: "pain-relief-ayurvedic-massage", duration: 75, price: 1999, discountPrice: 1599, categoryId: categoryMap["spa-massage"], gender: "unisex" as const },
    { name: "Head, Neck & Shoulder Massage", slug: "head-neck-shoulder-massage", duration: 30, price: 599, discountPrice: 449, categoryId: categoryMap["spa-massage"], gender: "unisex" as const },
    { name: "Premium Foot Reflexology", slug: "foot-reflexology", duration: 45, price: 899, discountPrice: 699, categoryId: categoryMap["spa-massage"], gender: "unisex" as const },
    { name: "Korean Body Polishing & Scrub", slug: "body-polishing", duration: 75, price: 2499, discountPrice: 1899, categoryId: categoryMap["spa-massage"], gender: "female" as const },
    { name: "Multi-Session Spa Massage (Pack of 3)", slug: "multisession-spa-package", duration: 180, price: 5499, discountPrice: 3999, categoryId: categoryMap["spa-massage"], gender: "unisex" as const },

    // Waxing Services
    { name: "Rica Chocolate Waxing (Full Body)", slug: "rica-chocolate-wax-full-body", duration: 90, price: 1999, discountPrice: 1599, categoryId: categoryMap["waxing"], gender: "female" as const },
    { name: "Roll-on Waxing (Arms & Underarms)", slug: "rollon-waxing-arms-underarms", duration: 30, price: 699, discountPrice: 499, categoryId: categoryMap["waxing"], gender: "female" as const },
    { name: "Rica Brazilian Bikini Waxing", slug: "rica-brazilian-bikini-wax", duration: 40, price: 1299, discountPrice: 999, categoryId: categoryMap["waxing"], gender: "female" as const },
    { name: "Honey Full Waxing (Underarms + Full Arms + Full Legs)", slug: "honey-full-waxing-combo", duration: 60, price: 999, discountPrice: 799, categoryId: categoryMap["waxing"], gender: "female" as const },
    { name: "Rica Liposoluble Waxing (Full Legs)", slug: "rica-liposoluble-legs-wax", duration: 35, price: 799, discountPrice: 599, categoryId: categoryMap["waxing"], gender: "female" as const },

    // Facial & Cleanup
    { name: "Cheryl's Cosmeceuticals GlowVera Facial", slug: "cheryls-glowvera-facial", duration: 60, price: 1599, discountPrice: 1299, categoryId: categoryMap["facial-cleanup"], gender: "female" as const },
    { name: "Lotus Herbals Radiant Gold Facial", slug: "lotus-radiant-gold-facial", duration: 60, price: 1399, discountPrice: 1099, categoryId: categoryMap["facial-cleanup"], gender: "female" as const },
    { name: "Sara Herbals D-Tan Cleanup", slug: "sara-dtan-cleanup", duration: 40, price: 799, discountPrice: 599, categoryId: categoryMap["facial-cleanup"], gender: "female" as const },
    { name: "O3+ Shine & Glow Cleanup", slug: "o3-shine-glow-cleanup", duration: 45, price: 1199, discountPrice: 899, categoryId: categoryMap["facial-cleanup"], gender: "female" as const },
    { name: "Anti-Acne Deep Pore Cleansing Treatment", slug: "anti-acne-deep-cleansing", duration: 50, price: 1499, discountPrice: 1199, categoryId: categoryMap["facial-cleanup"], gender: "female" as const },

    // Bridal Studio
    { name: "Luxury Bridal HD Makeup & Styling", slug: "luxury-bridal-hd-makeup", duration: 180, price: 14999, discountPrice: 11999, categoryId: categoryMap["bridal"], gender: "female" as const, isFeatured: true },
    { name: "Airbrush Bridal Masterclass Makeover", slug: "airbrush-bridal-makeup", duration: 180, price: 19999, discountPrice: 15999, categoryId: categoryMap["bridal"], gender: "female" as const },
    { name: "Engagement / Sagan Occasion Makeup", slug: "engagement-makeup", duration: 120, price: 6999, discountPrice: 5499, categoryId: categoryMap["bridal"], gender: "female" as const },
    { name: "Party Makeup & Hair Styling Combo", slug: "party-makeup-styling", duration: 90, price: 3499, discountPrice: 2799, categoryId: categoryMap["bridal"], gender: "female" as const },
    { name: "Saree Draping & Hair Bun Styling", slug: "saree-draping-hair-bun", duration: 45, price: 999, discountPrice: 799, categoryId: categoryMap["bridal"], gender: "female" as const },

    // Mehendi Artistry
    { name: "Classic Full Bridal Mehendi (Both Sides)", slug: "bridal-mehendi-classic", duration: 240, price: 5999, discountPrice: 4599, categoryId: categoryMap["mehendi"], gender: "female" as const, isFeatured: true },
    { name: "Modern Arabic Mehendi (Front & Back)", slug: "arabic-mehendi", duration: 90, price: 1499, discountPrice: 1199, categoryId: categoryMap["mehendi"], gender: "female" as const },
    { name: "Elegant Indo-Western Mehendi Designs", slug: "indo-western-mehendi", duration: 120, price: 2499, discountPrice: 1999, categoryId: categoryMap["mehendi"], gender: "female" as const },
    { name: "Simple Family / Guest Mehendi (Per Hand)", slug: "guest-mehendi", duration: 30, price: 299, discountPrice: 199, categoryId: categoryMap["mehendi"], gender: "female" as const },

    // Male Grooming
    { name: "Men's Designer Haircut & Styling", slug: "mens-haircut-styling", duration: 30, price: 299, discountPrice: 199, categoryId: categoryMap["male-grooming"], gender: "male" as const },
    { name: "Royal Beard Trim & Hot Towel Shave", slug: "mens-beard-trim-shave", duration: 25, price: 199, discountPrice: 149, categoryId: categoryMap["male-grooming"], gender: "male" as const },
    { name: "Men's Skin Brightening D-Tan Cleanup", slug: "mens-dtan-cleanup", duration: 40, price: 699, discountPrice: 499, categoryId: categoryMap["male-grooming"], gender: "male" as const, isFeatured: true },
    { name: "Men's Charcoal Blackhead Peel-off Facial", slug: "mens-charcoal-facial", duration: 45, price: 899, discountPrice: 699, categoryId: categoryMap["male-grooming"], gender: "male" as const },
    { name: "Men's Energizing Head & Shoulder Massage", slug: "mens-head-shoulder-massage", duration: 30, price: 499, discountPrice: 349, categoryId: categoryMap["male-grooming"], gender: "male" as const },
    { name: "Men's Full Body Stress Relief Massage", slug: "mens-body-massage", duration: 75, price: 1699, discountPrice: 1399, categoryId: categoryMap["male-grooming"], gender: "male" as const },

    // Hair
    { name: "Keratin Deep Nourishing Therapy", slug: "keratin-therapy", duration: 120, price: 3999, discountPrice: 2999, categoryId: categoryMap["hair"], gender: "unisex" as const },
    { name: "Ultra Straight Smoothening Treatment", slug: "hair-smoothening", duration: 150, price: 4999, discountPrice: 3899, categoryId: categoryMap["hair"], gender: "unisex" as const },
    { name: "Global Hair Coloring (Premium Ammonia-Free)", slug: "global-hair-coloring", duration: 90, price: 2499, discountPrice: 1999, categoryId: categoryMap["hair"], gender: "unisex" as const },
    { name: "Anti-Hairfall Treatment + Spa Combo", slug: "antihairfall-spa-combo", duration: 60, price: 1499, discountPrice: 1199, categoryId: categoryMap["hair"], gender: "unisex" as const },
    { name: "Women's Signature Blow Dry & Styling", slug: "womens-blowdry-styling", duration: 45, price: 799, discountPrice: 599, categoryId: categoryMap["hair"], gender: "female" as const },

    // HydraGlo
    { name: "Classic HydraGlo Skin Infusion Facial", slug: "classic-hydraglo", duration: 60, price: 2999, discountPrice: 2499, categoryId: categoryMap["hydraglo"], gender: "unisex" as const, isFeatured: true },
    { name: "SuperBright HydraGlo with Vitamin C", slug: "superbright-hydraglo", duration: 75, price: 3999, discountPrice: 3199, categoryId: categoryMap["hydraglo"], gender: "unisex" as const },
    { name: "Age-Defying Gold-Peptide HydraGlo", slug: "agedefying-hydraglo", duration: 90, price: 4999, discountPrice: 3999, categoryId: categoryMap["hydraglo"], gender: "unisex" as const },
    { name: "Mini HydraGlo Express Booster", slug: "mini-hydraglo", duration: 40, price: 1999, discountPrice: 1599, categoryId: categoryMap["hydraglo"], gender: "unisex" as const },

    // Laser
    { name: "Underarms Laser Hair Reduction (Single Session)", slug: "underarms-laser-hair-reduction", duration: 30, price: 1499, discountPrice: 999, categoryId: categoryMap["laser"], gender: "unisex" as const },
    { name: "Full Face Laser Glow Treatment", slug: "full-face-laser-glow", duration: 45, price: 2999, discountPrice: 2299, categoryId: categoryMap["laser"], gender: "unisex" as const },
    { name: "Full Body Laser Hair Reduction Combo (Pack of 3)", slug: "full-body-laser-reduction-3", duration: 180, price: 24999, discountPrice: 19999, categoryId: categoryMap["laser"], gender: "unisex" as const, isFeatured: true },
    { name: "Full Arms + Full Legs Laser Hair Reduction", slug: "arms-legs-laser-reduction", duration: 90, price: 7999, discountPrice: 5999, categoryId: categoryMap["laser"], gender: "unisex" as const },
  ];

  for (const svc of servicesData) {
    let imgPath = `/assets/service-${svc.slug}.png`;
    const fullPath = path.join(process.cwd(), "public", imgPath);
    
    if (!fs.existsSync(fullPath)) {
      // Fallback logic
      imgPath = `/assets/service-${svc.slug.includes("bridal") ? "bridal" : svc.slug.includes("spa") ? "spa" : svc.slug.includes("facial") ? "facial" : svc.slug.includes("hair") ? "hair" : svc.slug.includes("mehendi") ? "mehendi" : "nails"}.jpg`;
      
      if (svc.slug.includes("laser")) {
        imgPath = "/assets/service-laser.png";
      } else if (svc.slug.includes("hydraglo")) {
        imgPath = "/assets/service-hydraglo.png";
      } else if (svc.slug.includes("wax") || svc.slug.includes("waxing")) {
        imgPath = "/assets/service-waxing.png";
      } else if (svc.slug.includes("cleanup") || svc.slug.includes("cleansing")) {
        imgPath = "/assets/service-cleanup.png";
      } else if (svc.slug.includes("threading")) {
        imgPath = "/assets/service-threading.png";
      } else if (svc.slug.includes("polishing")) {
        imgPath = "/assets/service-body-polishing.png";
      } else if (svc.slug === "mens-body-massage") {
        imgPath = "/assets/service-mens-body-massage.png";
      } else if (svc.slug === "mens-head-shoulder-massage" || (svc.slug.includes("hair") && svc.categoryId === categoryMap["male-grooming"])) {
        imgPath = "/assets/service-mens-hair-spa.png";
      } else if (svc.slug.includes("grooming") || svc.slug.includes("beard") || svc.slug.includes("mens-haircut") || (svc.categoryId === categoryMap["male-grooming"])) {
        imgPath = "/assets/service-malegrooming.png";
      }
    }

    await db.insert(services).values({
      ...svc,
      image: imgPath,
      isActive: true,
      sortOrder: 0,
    });
  }
  console.log(`💅 Seeded ${servicesData.length} services.`);

  // 6. Insert Users, Addresses, Bookings, and Reviews for Customer Reviews
  const reviewsData = [
    {
      name: "Aanya M.",
      phone: "9172482533",
      email: "aanya@gmail.com",
      area: "Civil Lines",
      pincode: "243001",
      rating: 5,
      comment: "Booked the bridal trial a week before my engagement. The artist showed up early, kit organised like a film set. I cried (then laughed) when I saw the mirror.",
    },
    {
      name: "Rohan K.",
      phone: "9172482534",
      email: "rohan@gmail.com",
      area: "Rampur Garden",
      pincode: "243001",
      rating: 5,
      comment: "Got the deep-tissue spa for my mother's birthday. She fell asleep mid-session and rebooked the next week. That's the only review you need.",
    },
    {
      name: "Priya S.",
      phone: "9172482535",
      email: "priya@gmail.com",
      area: "Sheel Chauraha",
      pincode: "243001",
      rating: 5,
      comment: "Mehendi for 14 cousins, 6 hours flat, three artists working in sync. Hermosa turned my haldi into the calmest part of the wedding.",
    },
    {
      name: "Ishita R.",
      phone: "9172482536",
      email: "ishita@gmail.com",
      area: "Subhash Nagar",
      pincode: "243001",
      rating: 5,
      comment: "Honey waxing at home, candlelight, my own playlist. I am never going back to a salon.",
    },
    {
      name: "Megha T.",
      phone: "9172482537",
      email: "megha@gmail.com",
      area: "Krishna Puri",
      pincode: "243001",
      rating: 5,
      comment: "Facial + cleanup combo, brand products, no upselling. The therapist explained every step. Felt like a five-star resort in my own bedroom.",
    },
  ];

  for (let i = 0; i < reviewsData.length; i++) {
    const item = reviewsData[i];
    // Create user
    const userRes = await db.insert(users).values({
      name: item.name,
      phone: item.phone,
      email: item.email,
      role: "customer",
    }).returning();
    const userId = userRes[0].id;

    // Create address
    const addrRes = await db.insert(addresses).values({
      userId,
      label: "Home",
      line1: item.area,
      city: "Bareilly",
      pincode: item.pincode,
    }).returning();
    const addressId = addrRes[0].id;

    // Create booking
    const bookRes = await db.insert(bookings).values({
      bookingNumber: `HRM-2025-SEED0${i + 1}`,
      userId,
      addressId,
      scheduledAt: new Date(),
      status: "completed",
      totalAmount: 999,
      paymentStatus: "paid",
    }).returning();
    const bookingId = bookRes[0].id;

    // Create review
    await db.insert(reviews).values({
      bookingId,
      userId,
      rating: item.rating,
      comment: item.comment,
      isApproved: true,
    });
  }
  console.log(`💬 Seeded ${reviewsData.length} customer reviews.`);

  console.log("✅ Seeding completed successfully!");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
