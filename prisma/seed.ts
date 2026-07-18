import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// Helper to generate slugs
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.blockedDate.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.purchaseInquiry.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.subcategory.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Create Categories & Subcategories
  const categoriesData = [
    {
      name: "Necklaces",
      subcategories: ["Kundan", "Polki", "Temple Jewellery", "Pearl Necklaces", "Antique Gold"]
    },
    {
      name: "Earrings",
      subcategories: ["Jhumkas", "Chandbalis", "Studs", "Drop Earrings"]
    },
    {
      name: "Bangles & Bracelets",
      subcategories: ["Kadas", "Traditional Bangles", "Stone Studded Bangles"]
    },
    {
      name: "Bridal Sets",
      subcategories: ["Grand Chokers", "Complete Bridal Combos", "Premium Collections"]
    },
    {
      name: "Maang Tikka",
      subcategories: ["Kundan Tikka", "Mathapatti", "Borla"]
    },
    {
      name: "Rings",
      subcategories: ["Statement Rings", "Cocktail Rings", "Bridal Rings"]
    },
    {
      name: "Anklets",
      subcategories: ["Silver Finish", "Kundan Anklets", "Temple Style"]
    },
    {
      name: "Combos",
      subcategories: ["Necklace & Earring Sets", "Bangle & Ring Sets"]
    }
  ];

  const categoriesMap: { [key: string]: any } = {};
  const subcategoriesMap: { [key: string]: any } = {};

  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: slugify(cat.name)
      }
    });
    categoriesMap[cat.name] = category;

    for (const subName of cat.subcategories) {
      const subcategory = await prisma.subcategory.create({
        data: {
          name: subName,
          slug: slugify(subName + "-" + cat.name),
          categoryId: category.id
        }
      });
      subcategoriesMap[`${cat.name}_${subName}`] = subcategory;
    }
  }

  console.log("Created Categories and Subcategories.");

  // Images from Unsplash that represent high quality jewelry
  const jewelryImages = [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"
  ];

  // Helper to pick random elements
  const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  // 2. Create Sample Products (20-30 products)
  const productsData = [
    // Necklaces
    { name: "Royal Kundan Choker", category: "Necklaces", sub: "Kundan", desc: "A luxurious royal Kundan choker embellished with micro-pearls and green semi-precious beads. Ideal for traditional weddings." },
    { name: "Antique Temple Nakshi Haram", category: "Necklaces", sub: "Temple Jewellery", desc: "Traditional Nakshi Haram necklace set featuring intricate carvings of Goddess Lakshmi. Heavily detailed antique gold finish." },
    { name: "Polki Pearl Maharani Haar", category: "Necklaces", sub: "Polki", desc: "A majestic multi-layered Maharani Haar with uncut Polki stones and premium freshwater pearls. Crafted for a royal bridal look." },
    { name: "Classic Pearl Choker Set", category: "Necklaces", sub: "Pearl Necklaces", desc: "Elegant choker featuring multiple strands of fine pearls and a central gold pendant set with ruby doublets." },

    // Earrings
    { name: "Kundan Jhumka Earrings", category: "Earrings", sub: "Jhumkas", desc: "Traditional Kundan jhumkas with pearl hangings and floral design details. Exquisite matching for bridal outfits." },
    { name: "Gold Plated Chandbalis", category: "Earrings", sub: "Chandbalis", desc: "Elegant moon-shaped earrings studded with AD stones and finished with tiny hanging pearls." },
    { name: "Solitaire AD Studs", category: "Earrings", sub: "Studs", desc: "Premium American Diamond solitaire studs in an elegant silver-plated setting. Highly sparkling and minimalist." },

    // Bangles
    { name: "Ruby studded Kada Pair", category: "Bangles & Bracelets", sub: "Kadas", desc: "A pair of traditional openable kadas studded with red rubies and gold floral carvings." },
    { name: "Kundan Bangle Set", category: "Bangles & Bracelets", sub: "Traditional Bangles", desc: "Set of 4 traditional bangles with detailed Kundan work and green enamel detailing." },

    // Bridal Sets
    { name: "Complete Grand Temple Bridal Set", category: "Bridal Sets", sub: "Complete Bridal Combos", desc: "A comprehensive temple-style bridal set including long haram, choker, earrings, maang tikka, bajuband, and waistbelt." },
    { name: "Royal Polki & Emerald Bridal Set", category: "Bridal Sets", sub: "Premium Collections", desc: "High-end bridal combo with choker, long necklace, heavy earrings, and mathapatti studded with real-look polki and emeralds." },

    // Maang Tikka
    { name: "Gold Mathapatti with Kundan", category: "Maang Tikka", sub: "Mathapatti", desc: "A stunning triple-strand mathapatti with Kundan embellishments, framing the face beautifully for a bridal look." },
    { name: "Classic Kundan Borla", category: "Maang Tikka", sub: "Borla", desc: "Traditional Rajasthani Borla decorated with pearls and red stones. Traditional and elegant." },

    // Rings
    { name: "Statement Cocktail Ring", category: "Rings", sub: "Cocktail Rings", desc: "Oversized gold plated ring featuring a large central ruby surrounded by sparkling AD stones." },
    { name: "Aesthetic Kundan Bridal Ring", category: "Rings", sub: "Bridal Rings", desc: "Adjustable premium bridal ring with fine kundan mirror work in a flower pattern." },

    // Anklets
    { name: "Royal Bridal Payal Set", category: "Anklets", sub: "Silver Finish", desc: "Heavy traditional silver-plated anklets with chiming ghungroos. Elegant and musical." },

    // Combos
    { name: "Polki Necklace & Jhumka Combo", category: "Combos", sub: "Necklace & Earring Sets", desc: "Beautifully paired antique gold polki necklace along with matching heavy jhumka earrings." }
  ];

  // We want at least 20-30 products, so let's add some more general ones
  const extraProducts = [
    { name: "Victorian Emerald Choker", category: "Necklaces", sub: "Antique Gold", desc: "Exquisite Victorian style choker set with emerald drops and diamonds." },
    { name: "South Indian Guttapusalu Haram", category: "Necklaces", sub: "Temple Jewellery", desc: "Authentic Guttapusalu design necklace filled with clusters of tiny pearls." },
    { name: "Kundan Peacock Choker", category: "Necklaces", sub: "Kundan", desc: "Elegant choker featuring a central peacock motif studded with Kundan glass stones." },
    { name: "Meenakari Floral Jhumkas", category: "Earrings", sub: "Jhumkas", desc: "Bright and colorful Meenakari work earrings with floral enamel." },
    { name: "Premium AD Bangles Set", category: "Bangles & Bracelets", sub: "Stone Studded Bangles", desc: "Set of 2 sparkling AD bracelets. Modern look, perfect for receptions." },
    { name: "Minimalist Mathapatti", category: "Maang Tikka", sub: "Mathapatti", desc: "Single strand simple mathapatti with fine pearl detailing." },
    { name: "Ruby Marquise Ring", category: "Rings", sub: "Statement Rings", desc: "Unique marquise cut ruby ring in a detailed gold filigree pattern." },
    { name: "Kundan Anklet Chain", category: "Anklets", sub: "Kundan Anklets", desc: "Thin elegant payal chain with hanging Kundan beads." }
  ];

  const allProductsToSeed = [...productsData, ...extraProducts];
  const seededProducts = [];

  for (const prod of allProductsToSeed) {
    const category = categoriesMap[prod.category];
    const subcategory = subcategoriesMap[`${prod.category}_${prod.sub}`];

    // Determine type
    const type = randomElement(["rent", "sale", "both"]);
    
    // Pricing
    let priceSale = null;
    let priceRentPerPeriod = null;
    if (type === "sale" || type === "both") {
      priceSale = randomRange(1999, 15999);
    }
    if (type === "rent" || type === "both") {
      priceRentPerPeriod = randomRange(499, 4999);
    }

    // Rent durations (e.g. "3,5,7" or "3,5,7,10,15")
    const rentDurations = randomElement(["3,5,7", "3,5,7,10,15", "5,7,10"]);

    // Pick 2-3 images
    const img1 = randomElement(jewelryImages);
    let img2 = randomElement(jewelryImages);
    while (img1 === img2) {
      img2 = randomElement(jewelryImages);
    }
    const images = `${img1},${img2}`;

    const stockStatus = randomElement(["available", "available", "available", "out_of_stock"]);
    const featured = randomElement([true, false, false, false]);

    const product = await prisma.product.create({
      data: {
        name: prod.name,
        slug: slugify(prod.name + "-" + randomRange(100, 999)),
        description: prod.desc,
        categoryId: category.id,
        subcategoryId: subcategory ? subcategory.id : null,
        type,
        priceSale,
        priceRentPerPeriod,
        rentDurations,
        images,
        stockStatus,
        featured
      }
    });

    seededProducts.push(product);
  }

  console.log(`Created ${seededProducts.length} Products.`);

  // 3. Create some sample bookings and block dates
  console.log("Seeding sample bookings...");
  const rentProducts = seededProducts.filter(p => p.type === "rent" || p.type === "both");

  // Booking 1: Confirmed booking, blocks dates
  if (rentProducts.length > 0) {
    const targetProduct = rentProducts[0];
    
    // Set start date to today + 2 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // 3 days rental
    endDate.setHours(0, 0, 0, 0);

    const booking = await prisma.booking.create({
      data: {
        productId: targetProduct.id,
        customerName: "Pooja Sharma",
        phone: "9876543210",
        startDate,
        endDate,
        durationDays: 3,
        totalAmount: (targetProduct.priceRentPerPeriod || 1000) * 1.0, // base price
        status: "confirmed"
      }
    });

    // Create BlockedDates for that range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      await prisma.blockedDate.create({
        data: {
          productId: targetProduct.id,
          date: new Date(currentDate)
        }
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Created confirmed booking blocking dates for ${targetProduct.name}`);
  }

  // Booking 2: Pending booking
  if (rentProducts.length > 1) {
    const targetProduct = rentProducts[1];
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5); // 5 days rental
    endDate.setHours(0, 0, 0, 0);

    await prisma.booking.create({
      data: {
        productId: targetProduct.id,
        customerName: "Aishwarya Rai",
        phone: "9988776655",
        startDate,
        endDate,
        durationDays: 5,
        totalAmount: (targetProduct.priceRentPerPeriod || 1000) * 1.5, // 1.5x for 5 days
        status: "pending"
      }
    });

    // Also block dates for pending bookings (as requested in PRD)
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      await prisma.blockedDate.create({
        data: {
          productId: targetProduct.id,
          date: new Date(currentDate)
        }
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Created pending booking blocking dates for ${targetProduct.name}`);
  }

  // Seeding a Purchase Inquiry
  const saleProducts = seededProducts.filter(p => p.type === "sale" || p.type === "both");
  if (saleProducts.length > 0) {
    const targetProduct = saleProducts[0];
    await prisma.purchaseInquiry.create({
      data: {
        productId: targetProduct.id,
        customerName: "Kiran Mehta",
        phone: "9123456789"
      }
    });
    console.log(`Created purchase inquiry for ${targetProduct.name}`);
  }

  console.log("Seeding complete! Database is ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
