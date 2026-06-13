// Hermosa Brand Image Registry - Single Source of Truth
// Formally maps each service slug, category slug, and offer ID to its validated visual asset.
// PINS version query parameter to bypass service worker static cache.

const IMAGE_VERSION = "hermosa-luxe-v4";

const SERVICES_IMAGES: Record<string, string> = {
  // Female Salon / Waxing / Facials
  "premium-honey-wax-arms-legs": "/assets/service-premium-honey-wax-arms-legs.png",
  "o3-glow-facial": "/assets/service-o3-glow-facial.png",
  "threading-eyebrow-upperlip": "/assets/service-threading-eyebrow-upperlip.png",
  "loreal-hair-spa": "/assets/service-loreal-hair-spa.png",
  "pedi-mani-classic": "/assets/service-pedi-mani-classic.png",
  "premium-dtan-face-neck": "/assets/service-premium-dtan-face-neck.png",
  
  // Spa & Massage
  "aroma-therapy-body-massage": "/assets/service-aroma-therapy-body-massage.png",
  "deep-tissue-stress-relief": "/assets/service-deep-tissue-stress-relief.png",
  "swedish-back-shoulder-massage": "/assets/service-swedish-back-shoulder-massage.png",
  "pain-relief-ayurvedic-massage": "/assets/service-pain-relief-ayurvedic-massage.png",
  "head-neck-shoulder-massage": "/assets/service-head-neck-shoulder-massage.png",
  "foot-reflexology": "/assets/service-foot-reflexology.png",
  "body-polishing": "/assets/service-body-polishing.png",
  "multisession-spa-package": "/assets/ad-multisession.png",
  
  // Waxing Services
  "rica-chocolate-wax-full-body": "/assets/service-rica-chocolate-wax-full-body.png",
  "rollon-waxing-arms-underarms": "/assets/service-rollon-waxing-arms-underarms.png",
  "rica-brazilian-bikini-wax": "/assets/service-rica-brazilian-bikini-wax.png",
  "honey-full-waxing-combo": "/assets/service-honey-full-waxing-combo.png",
  "rica-liposoluble-legs-wax": "/assets/service-rica-liposoluble-legs-wax.png",
  
  // Facial & Cleanup
  "cheryls-glowvera-facial": "/assets/service-cheryls-glowvera-facial.png",
  "lotus-radiant-gold-facial": "/assets/service-lotus-radiant-gold-facial.png",
  "sara-dtan-cleanup": "/assets/service-sara-dtan-cleanup.png",
  "o3-shine-glow-cleanup": "/assets/service-o3-shine-glow-cleanup.png",
  "anti-acne-deep-cleansing": "/assets/service-anti-acne-deep-cleansing.png",
  
  // Bridal Studio & Makeup
  "luxury-bridal-hd-makeup": "/assets/service-luxury-bridal-hd-makeup.png",
  "airbrush-bridal-makeup": "/assets/service-airbrush-bridal-makeup.png",
  "engagement-makeup": "/assets/service-engagement-makeup.png",
  "party-makeup-styling": "/assets/service-party-makeup-styling.png",
  "saree-draping-hair-bun": "/assets/service-saree-draping-hair-bun.png",
  
  // Mehendi Artistry
  "bridal-mehendi-classic": "/assets/service-bridal-mehendi-classic.png",
  "arabic-mehendi": "/assets/service-arabic-mehendi.png",
  "indo-western-mehendi": "/assets/service-indo-western-mehendi.png",
  "guest-mehendi": "/assets/service-guest-mehendi.png",
  
  // Male Grooming
  "mens-haircut-styling": "/assets/service-mens-haircut-styling.png",
  "mens-beard-trim-shave": "/assets/service-mens-beard-trim-shave.png",
  "mens-dtan-cleanup": "/assets/service-mens-dtan-cleanup.png",
  "mens-charcoal-facial": "/assets/service-mens-charcoal-facial.png",
  "mens-head-shoulder-massage": "/assets/service-mens-head-shoulder-massage.png",
  "mens-body-massage": "/assets/service-mens-body-massage.png",
  
  // Hair Care & Styling (Unisex)
  "keratin-therapy": "/assets/service-keratin-therapy.png",
  "hair-smoothening": "/assets/service-hair-smoothening.png",
  "global-hair-coloring": "/assets/service-global-hair-coloring.png",
  "antihairfall-spa-combo": "/assets/service-antihairfall-spa-combo.png",
  "womens-blowdry-styling": "/assets/service-womens-blowdry-styling.png",
  
  // HydraGlo (Unisex)
  "classic-hydraglo": "/assets/service-classic-hydraglo.png",
  "superbright-hydraglo": "/assets/service-superbright-hydraglo.png",
  "agedefying-hydraglo": "/assets/service-agedefying-hydraglo.png",
  "mini-hydraglo": "/assets/service-mini-hydraglo.png",
  
  // Laser (Unisex)
  "underarms-laser-hair-reduction": "/assets/service-underarms-laser-hair-reduction.png",
  "full-face-laser-glow": "/assets/service-full-face-laser-glow.png",
  "full-body-laser-reduction-3": "/assets/service-full-body-laser-reduction-3.png",
  "arms-legs-laser-reduction": "/assets/service-arms-legs-laser-reduction.png"
};

const CATEGORIES_IMAGES: Record<string, string> = {
  "female-salon": "/assets/cat-salon-women.png",
  "spa-massage": "/assets/cat-spa-women.png",
  "waxing": "/assets/service-waxing.png",
  "facial-cleanup": "/assets/service-cleanup.png",
  "bridal": "/assets/cat-makeup.png",
  "mehendi": "/assets/service-bridal-mehendi-classic.png",
  "male-grooming": "/assets/service-mens-haircut-styling.png",
  "hair": "/assets/service-womens-blowdry-styling.png",
  "hydraglo": "/assets/cat-hydraglo.png",
  "laser": "/assets/cat-laser.png",
  
  // Homepage category grid specific IDs
  "salon-for-women": "/assets/cat-salon-women.png",
  "spa-for-women": "/assets/cat-spa-women.png",
  "hydraglo-facials": "/assets/cat-hydraglo.png",
  "laser-treatments": "/assets/cat-laser.png",
  "body-toning": "/assets/cat-body-toning.png",
  "makeup-styling": "/assets/cat-makeup.png",
  "male-spa": "/assets/service-mens-body-massage.png",
  "male-hair": "/assets/service-mens-head-shoulder-massage.png",
  "male-hydraglo": "/assets/service-mens-charcoal-facial.png"
};

const TRENDING_OFFERS_IMAGES: Record<string, string> = {
  "aroma-therapy-body-massage": "/assets/ad-spa-ritual.png",
  "loreal-hair-spa": "/assets/ad-hair-spa.png",
  "body-polishing": "/assets/ad-body-polishing.png",
  "multisession-spa-package": "/assets/ad-multisession.png",
  "mens-body-massage": "/assets/ad-spa-ritual-male.png",
  "mens-head-shoulder-massage": "/assets/service-mens-hair-spa.png",
  "mens-dtan-cleanup": "/assets/service-mens-dtan-cleanup.png"
};

const BANNER_IMAGES: Record<string, string> = {
  // Female Banners (All 13 new ad banners from Google Drive)
  "bloomads": "/assets/bloomads.png",
  "daimond-ads": "/assets/daimond-ads.png",
  "fluxads": "/assets/fluxads.png",
  "glassskin-ads": "/assets/glassskin-ads.png",
  "hydroglo-ads-d": "/assets/hydroglo-ads-d.png",
  "hydroglowads": "/assets/hydroglowads.png",
  "korean-body-posiling-ads": "/assets/korean-body-posiling-ads.png",
  "korean-hair-spa-ads": "/assets/korean-hair-spa-ads.png",
  "korean-wax-ads": "/assets/korean-wax-ads.png",
  "korean-wax-adsk": "/assets/korean-wax-adsk.png",
  "mani-cure-ads": "/assets/mani-cure-ads.png",
  "radiant-ads": "/assets/radiant-ads.png",
  "revivl-ads": "/assets/revivl-ads.png",
  // Men's Banners (New premium banners featuring male models from Google Drive)
  "refersh-ads": "/assets/refersh-ads.png",
  "smooth-sharpads": "/assets/smooth-sharpads.png",
  "glowboost-ads": "/assets/glowboost-ads.png",
  "mens-facialads": "/assets/mens-facialads.png",
  "deepclean-aads": "/assets/deepclean-aads.png",
  "greenads": "/assets/greenads.png",
  "dextfacads": "/assets/dextfacads.png"
};

export class HermosaImageRegistry {
  // Append cache busting version to query params
  static appendVersion(path: string): string {
    if (!path) return "";
    return `${path}?v=${IMAGE_VERSION}`;
  }

  // Resolve service image with title-first and gender segmentation logic
  static resolveServiceImage(
    slug: string,
    name?: string,
    categorySlug?: string,
    gender?: "female" | "male" | "unisex"
  ): string {
    const activeGender = gender || "female";

    // 1. Direct Lookup by Slug
    // If gender is male, check if we have a male version of the unisex service
    if (activeGender === "male") {
      // Swaps unisex service to a male-focused asset
      if (slug === "multisession-spa-package") {
        return this.appendVersion("/assets/ad-multisession-male.png");
      }
      if (slug.includes("massage") || slug.includes("spa") || slug.includes("reflexology")) {
        if (slug.includes("head") || slug.includes("shoulder")) {
          return this.appendVersion("/assets/service-mens-head-shoulder-massage.png");
        }
        return this.appendVersion("/assets/service-mens-body-massage.png");
      }
      if (slug.includes("hair") || slug.includes("color") || slug.includes("smooth") || slug.includes("keratin")) {
        return this.appendVersion("/assets/service-mens-hair-spa.png");
      }
      if (slug.includes("hydraglo") || slug.includes("facial") || slug.includes("cleanup") || slug.includes("cleansing")) {
        return this.appendVersion("/assets/service-mens-dtan-cleanup.png");
      }
      
      // If it is explicitly in SERVICES_IMAGES and not swapped above
      if (SERVICES_IMAGES[slug]) {
        return this.appendVersion(SERVICES_IMAGES[slug]);
      }
    } else {
      // Female or Unisex default
      if (SERVICES_IMAGES[slug]) {
        return this.appendVersion(SERVICES_IMAGES[slug]);
      }
    }

    // 2. Fallback Title-First & Category-First Match
    const searchString = `${slug} ${name || ""} ${categorySlug || ""}`.toLowerCase();

    if (activeGender === "male") {
      if (searchString.includes("massage") || searchString.includes("spa") || searchString.includes("relax")) {
        return this.appendVersion("/assets/service-mens-body-massage.png");
      }
      if (searchString.includes("hair") || searchString.includes("styling") || searchString.includes("cut")) {
        return this.appendVersion("/assets/service-mens-haircut-styling.png");
      }
      if (searchString.includes("facial") || searchString.includes("cleanup") || searchString.includes("skin") || searchString.includes("tan")) {
        return this.appendVersion("/assets/service-mens-dtan-cleanup.png");
      }
      return this.appendVersion("/assets/service-mens-haircut-styling.png"); // Male default
    } else {
      if (searchString.includes("laser")) {
        return this.appendVersion("/assets/service-laser.png");
      }
      if (searchString.includes("hydraglo")) {
        return this.appendVersion("/assets/service-hydraglo.png");
      }
      if (searchString.includes("wax")) {
        return this.appendVersion("/assets/service-waxing.png");
      }
      if (searchString.includes("cleanup") || searchString.includes("cleansing")) {
        return this.appendVersion("/assets/service-cleanup.png");
      }
      if (searchString.includes("facial")) {
        return this.appendVersion("/assets/service-o3-glow-facial.png");
      }
      if (searchString.includes("massage") || searchString.includes("spa") || searchString.includes("polishing")) {
        if (searchString.includes("polishing")) {
          return this.appendVersion("/assets/service-body-polishing.png");
        }
        return this.appendVersion("/assets/service-aroma-therapy-body-massage.png");
      }
      if (searchString.includes("mehendi")) {
        return this.appendVersion("/assets/service-bridal-mehendi-classic.png");
      }
      if (searchString.includes("hair")) {
        return this.appendVersion("/assets/service-womens-blowdry-styling.png");
      }
      if (searchString.includes("makeup") || searchString.includes("bridal") || searchString.includes("draping")) {
        return this.appendVersion("/assets/service-luxury-bridal-hd-makeup.png");
      }
      return this.appendVersion("/assets/service-o3-glow-facial.png"); // Female default
    }
  }

  // Resolve Category Visual Avatar
  static resolveCategoryImage(slug: string, gender?: "female" | "male" | "unisex"): string {
    const activeGender = gender || "female";
    
    if (activeGender === "male") {
      if (slug === "spa-massage" || slug === "male-spa") {
        return this.appendVersion("/assets/service-mens-body-massage.png");
      }
      if (slug === "hair" || slug === "male-hair") {
        return this.appendVersion("/assets/service-mens-hair-spa.png");
      }
      if (slug === "hydraglo" || slug === "facial-cleanup" || slug === "male-hydraglo") {
        return this.appendVersion("/assets/service-mens-charcoal-facial.png");
      }
    }

    if (CATEGORIES_IMAGES[slug]) {
      return this.appendVersion(CATEGORIES_IMAGES[slug]);
    }

    return this.appendVersion("/assets/cat-salon-women.png");
  }

  // Resolve Trending campaign card image
  static resolveTrendingOfferImage(id: string, gender?: "female" | "male" | "unisex"): string {
    const activeGender = gender || "female";

    if (activeGender === "male") {
      if (id === "multisession-spa-package") {
        return this.appendVersion("/assets/ad-multisession-male.png");
      }
      if (id === "mens-body-massage" || id === "aroma-therapy-body-massage" || id === "deep-tissue-stress-relief") {
        return this.appendVersion("/assets/ad-spa-ritual-male.png");
      }
      if (id === "mens-head-shoulder-massage" || id === "loreal-hair-spa") {
        return this.appendVersion("/assets/service-mens-hair-spa.png");
      }
      if (id === "mens-dtan-cleanup") {
        return this.appendVersion("/assets/service-mens-dtan-cleanup.png");
      }
    }

    if (TRENDING_OFFERS_IMAGES[id]) {
      return this.appendVersion(TRENDING_OFFERS_IMAGES[id]);
    }

    // Default to resolving it as a normal service image
    return this.resolveServiceImage(id, undefined, undefined, activeGender);
  }

  // Resolve new ad banner image
  static resolveAdBannerImage(id: string): string {
    if (BANNER_IMAGES[id]) {
      return this.appendVersion(BANNER_IMAGES[id]);
    }
    return "";
  }
}
