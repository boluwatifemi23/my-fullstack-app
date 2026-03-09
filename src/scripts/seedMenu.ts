// scripts/seedMenu.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGO_URI as string;

// Category Schema
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  order: Number,
});

// Meal Schema
const mealSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: String,
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

const categories = [
  {
    name: "Small Chops",
    slug: "small-chops",
    description: "Minimum of 24 pcs each",
    order: 1,
  },
  {
    name: "Soups & Stews",
    slug: "soups-stews",
    description: "With dryfish and assorted cow meat - ½ pan",
    order: 2,
  },
  {
    name: "Stew",
    slug: "stew",
    description: "½ pan sizes",
    order: 3,
  },
  {
    name: "Special Delicacy",
    slug: "special-delicacy",
    description: "½ pan sizes",
    order: 4,
  },
  {
    name: "Salads",
    slug: "salads",
    description: "Fresh and healthy salads",
    order: 5,
  },
  {
    name: "Proteins",
    slug: "proteins",
    description: "½ pan sizes",
    order: 6,
  },
  {
    name: "Seafood",
    slug: "seafood",
    description: "Fresh seafood options",
    order: 7,
  },
  {
    name: "Main Dish",
    slug: "main-dish",
    description: "Rice and other staples",
    order: 8,
  },
  {
    name: "Accompaniments",
    slug: "accompaniments",
    description: "Perfect sides for your meal",
    order: 9,
  },
];

const meals = [
  // SMALL CHOPS
  { name: "Samosa/Springrolls", price: 2.5, category: "small-chops", description: "Minimum 24 pcs" },
  { name: "Scotch Eggs", price: 3, category: "small-chops", description: "Minimum 24 pcs" },
  { name: "Sausage Roll", price: 3, category: "small-chops", description: "Minimum 24 pcs" },
  { name: "Eggrolls", price: 3, category: "small-chops", description: "Minimum 24 pcs" },
  { name: "Nigerian Bons", price: 2, category: "small-chops", description: "Minimum 24 pcs" },
  { name: "Fishroll", price: 3, category: "small-chops", description: "Minimum 24 pcs" },
  { name: "Meat Pie", price: 3, category: "small-chops", description: "Minimum 24 pcs" },
  { name: "Agidi Jollof in Leaf with Fried Beef", price: 4, category: "small-chops", description: "Min 15pcs @ $4 or min 12pcs @ $5" },
  { name: "Puff-Puff", price: 50, category: "small-chops", description: "Small Foil Pan" },
  { name: "Akara", price: 60, category: "small-chops", description: "Small Foil Pan" },
  { name: "Moinmoin Elewe with Egg or Fish", price: 4, category: "small-chops", description: "Min 15pcs @ $4 or min 12pcs @ $5" },

  // SOUPS & STEWS
  { name: "Ogbono Soup", price: 110, category: "soups-stews", description: "½ pan with dryfish and assorted" },
  { name: "Fresh Vegetable Edikaikon", price: 110, category: "soups-stews", description: "½ pan" },
  { name: "Fresh Oha Soup", price: 150, category: "soups-stews", description: "½ pan" },
  { name: "Ofe Nsala (White Soup)", price: 110, category: "soups-stews", description: "½ pan with assorted or catfish" },
  { name: "Fisherman Soup", price: 120, category: "soups-stews", description: "½ pan with seafood or assorted" },
  { name: "Afang Soup", price: 129, category: "soups-stews", description: "½ pan" },
  { name: "Eforiro", price: 108, category: "soups-stews", description: "½ pan" },
  { name: "Okra Soup", price: 108, category: "soups-stews", description: "½ pan" },
  { name: "Okra with Assorted and Shrimps", price: 120, category: "soups-stews", description: "½ pan" },
  { name: "Melon Soup - Ofe Egusi", price: 108, category: "soups-stews", description: "½ pan" },
  { name: "Bitterleaf Soup", price: 108, category: "soups-stews", description: "½ pan" },
  { name: "Goat Pepper Soup", price: 120, category: "soups-stews", description: "½ pan" },
  { name: "Assorted Peppersoup", price: 98, category: "soups-stews", description: "½ pan" },
  { name: "Tilapia Pepper Soup", price: 80, category: "soups-stews", description: "½ pan" },
  { name: "Assorted Peppersoup", price: 270, category: "soups-stews", description: "1 full pan" },
  { name: "Tilapia Peppersoup", price: 240, category: "soups-stews", description: "1 full pan" },

  // STEW
  { name: "Buka Stew Assorted", price: 108, category: "stew", description: "½ pan" },
  { name: "Red Stew with Goat", price: 129, category: "stew", description: "½ pan" },
  { name: "Ofada with Assorted and Ejakika", price: 110, category: "stew", description: "½ pan" },
  { name: "Ayamase with Assorted and Ejakika", price: 110, category: "stew", description: "½ pan" },

  // SPECIAL DELICACY
  { name: "Abacha and Fried Fish", price: 120, category: "special-delicacy", description: "½ pan" },
  { name: "Abacha, Fried Fish and Ugba or Nkwobi", price: 150, category: "special-delicacy", description: "½ pan" },
  { name: "Cowleg Nkwobi (Boneless)", price: 150, category: "special-delicacy", description: "½ pan" },
  { name: "Isiewu (Boneless)", price: 180, category: "special-delicacy", description: "½ pan" },
  { name: "Ukwa", price: 150, category: "special-delicacy", description: "½ pan" },
  { name: "Achicha with Ugba and Fiofio", price: 150, category: "special-delicacy", description: "½ pan" },
  { name: "Ekpang Nkukwo", price: 130, category: "special-delicacy", description: "½ pan" },
  { name: "Pepper Ponmo", price: 160, category: "special-delicacy", description: "½ pan" },
  { name: "Ugba with Stockfish", price: 200, category: "special-delicacy", description: "½ pan" },
  { name: "Ayamase/Ofada and White Rice", price: 280, category: "special-delicacy", description: "1 full pan" },

  // SALADS
  { name: "Nigerian Style Salad with Corned Beef and Eggs", price: 70, category: "salads", description: "Small Foil Pan" },
  { name: "Nigerian Style Salad", price: 150, category: "salads", description: "Big Foil Pan" },
  { name: "Green Garden Salad", price: 40, category: "salads", description: "Small Foil Pan" },
  { name: "Green Garden Salad", price: 80, category: "salads", description: "Big Foil Pan" },
  { name: "Home-made Coleslaw Salad (Hand Cut)", price: 60, category: "salads", description: "Small Foil Pan" },
  { name: "Home-made Coleslaw Salad", price: 120, category: "salads", description: "Big Foil Pan" },

  // PROTEINS
  { name: "Pepper Chicken", price: 90, category: "proteins", description: "Small Foil Pan" },
  { name: "Pepper Chicken", price: 200, category: "proteins", description: "Big Foil Pan" },
  { name: "Stewed Combo Platter (Chicken, Fish & Beef)", price: 140, category: "proteins", description: "Small Foil Pan" },
  { name: "Stewed Combo Platter (Chicken, Fish & Beef)", price: 280, category: "proteins", description: "Big Foil Pan" },
  { name: "Stewed Chicken Fowl", price: 120, category: "proteins", description: "Small Pan" },
  { name: "Stewed Chicken Fowl", price: 250, category: "proteins", description: "Big Foil Pan" },
  { name: "Goat Asun", price: 170, category: "proteins", description: "Small Foil Pan" },
  { name: "Goat Asun", price: 350, category: "proteins", description: "Big Foil Pan" },
  { name: "Deboned Cowleg Asun", price: 130, category: "proteins", description: "Small Foil Pan" },
  { name: "Deboned Cowleg Asun", price: 280, category: "proteins", description: "Big Foil Pan" },
  { name: "Peppered Assorted (Beef, Shaki, Cow Feet)", price: 150, category: "proteins", description: "Small Foil Pan" },
  { name: "Peppered Assorted (Beef, Shaki, Cow Feet)", price: 300, category: "proteins", description: "Big Foil Pan" },
  { name: "Peppered Fried Beef", price: 145, category: "proteins", description: "Small Foil Pan" },
  { name: "Peppered Fried Beef", price: 300, category: "proteins", description: "Big Foil Pan" },
  { name: "Peppered Goat Meat", price: 170, category: "proteins", description: "Small Foil Pan" },
  { name: "Peppered Turkey", price: 100, category: "proteins", description: "Small Foil Pan" },
  { name: "Peppered Turkey", price: 220, category: "proteins", description: "Big Foil Pan" },
  { name: "Peppered Gizzards", price: 80, category: "proteins", description: "Small Foil Pan" },
  { name: "Peppered Gizzards", price: 180, category: "proteins", description: "Big Foil Pan" },
  { name: "Peppered Snails", price: 300, category: "proteins", description: "Full portion" },

  // SEAFOOD
  { name: "Peppered Fried Tilapia", price: 280, category: "seafood", description: "1 full pan" },
  { name: "Peppered Fried Tilapia", price: 130, category: "seafood", description: "½ pan" },
  { name: "Fresh Tilapia - Eja Tutu", price: 250, category: "seafood", description: "Big Foil Pan" },
  { name: "Stewed Croaker Fish", price: 135, category: "seafood", description: "Small Foil Pan" },
  { name: "Stewed Croaker Fish", price: 280, category: "seafood", description: "Big Foil Pan" },

  // MAIN DISH
  { name: "Delicious Smoky Jollof Rice", price: 50, category: "main-dish", description: "Small Foil Pan" },
  { name: "Delicious Smoky Jollof Rice", price: 120, category: "main-dish", description: "Big Foil Pan" },
  { name: "Delicious Smoky Jollof Rice", price: 238, category: "main-dish", description: "Cooler size" },
  { name: "Vegetable Fried Rice (Hand Cut)", price: 65, category: "main-dish", description: "Small Foil Pan" },
  { name: "Vegetable Fried Rice (Hand Cut)", price: 130, category: "main-dish", description: "Big Foil Pan" },
  { name: "Shrimp and Mixed Grill Fried Rice", price: 90, category: "main-dish", description: "Small Foil Pan with fresh handcut vegetables" },
  { name: "Shrimp and Mixed Grill Fried Rice", price: 250, category: "main-dish", description: "Big Foil Pan with fresh handcut vegetables" },
  { name: "Poundo Yam/Fufu", price: 3.5, category: "main-dish", description: "Price per wrap - minimum 24pcs" },
  { name: "Yam Porridge - Asaro with Fish", price: 90, category: "main-dish", description: "Small Foil Pan" },
  { name: "Yam Porridge - Asaro", price: 200, category: "main-dish", description: "Big Foil Pan" },

  // ACCOMPANIMENTS
  { name: "Plantain Gizzard", price: 230, category: "accompaniments", description: "Big Foil Pan" },
  { name: "Plantain Gizzard", price: 100, category: "accompaniments", description: "Small Foil Pan" },
  { name: "Golden Fried Plantain - Dodo", price: 70, category: "accompaniments", description: "Small Foil Pan" },
  { name: "Golden Fried Plantain - Dodo", price: 150, category: "accompaniments", description: "Big Foil Pan" },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Meal.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert categories
    await Category.insertMany(categories);
    console.log("✅ Categories seeded");

    // Insert meals
    await Meal.insertMany(meals);
    console.log("✅ Meals seeded");

    console.log(`\n📊 Summary:`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Meals: ${meals.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();