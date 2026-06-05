import { PrismaClient, DuaStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Categories
  const categoriesData = [
    { slug: "quranic-dua", nameBn: "কুরআনিক দুআ", nameEn: "Quranic Dua" },
    { slug: "hadith-dua", nameBn: "হাদিসের দুআ", nameEn: "Hadith Dua" },
    { slug: "forgiveness-dua", nameBn: "ক্ষমার দুআ", nameEn: "Forgiveness Dua" },
    { slug: "knowledge-dua", nameBn: "জ্ঞানের দুআ", nameEn: "Knowledge Dua" },
    { slug: "protection-dua", nameBn: "সুরক্ষার দুআ", nameEn: "Protection Dua" },
    { slug: "daily-life-dua", nameBn: "প্রাত্যহিক জীবনের দুআ", nameEn: "Daily Life Dua" },
  ];

  console.log("Seeding categories...");
  for (const cat of categoriesData) {
    await prisma.duaCategory.upsert({
      where: { slug: cat.slug },
      update: {
        nameBn: cat.nameBn,
        nameEn: cat.nameEn,
      },
      create: {
        slug: cat.slug,
        nameBn: cat.nameBn,
        nameEn: cat.nameEn,
      },
    });
  }

  // 2. Seed Books
  const booksData = [
    { slug: "morning-evening-dua", nameBn: "সকাল ও সন্ধ্যার দুআ", nameEn: "Morning & Evening Dua" },
    { slug: "shaykh-ahmadullah-collected-dua", nameBn: "শায়খ আহমাদুল্লাহর সংকলিত দুআ", nameEn: "Shaykh Ahmadullah Collected Dua" },
    { slug: "famous-scholars-collected-dua", nameBn: "প্রখ্যাত লেখকদের সংকলিত দুআ", nameEn: "Famous Scholars' Collected Dua" },
    { slug: "daily-life-duas", nameBn: "প্রাত্যহিক কাজের সকল দুআ", nameEn: "Daily Life Duas" },
  ];

  console.log("Seeding books...");
  for (const book of booksData) {
    await prisma.duaBook.upsert({
      where: { slug: book.slug },
      update: {
        nameBn: book.nameBn,
        nameEn: book.nameEn,
      },
      create: {
        slug: book.slug,
        nameBn: book.nameBn,
        nameEn: book.nameEn,
        status: DuaStatus.published,
      },
    });
  }

  // 3. Fetch Daily Life Duas Book to assign indexes
  const dailyLifeBook = await prisma.duaBook.findUnique({
    where: { slug: "daily-life-duas" },
  });

  if (!dailyLifeBook) {
    throw new Error("Could not find 'daily-life-duas' Book record after seeding.");
  }

  // 4. Seed Indexes under Daily Life Duas
  const indexesData = [
    { slug: "quranic-dua", titleBn: "কুরআনিক দুআ", titleEn: "Quranic Dua" },
    { slug: "forgiveness", titleBn: "ক্ষমা", titleEn: "Forgiveness" },
    { slug: "knowledge", titleBn: "জ্ঞান", titleEn: "Knowledge" },
    { slug: "hereafter", titleBn: "আখিরাত", titleEn: "Hereafter" },
    { slug: "morning-evening", titleBn: "সকাল-সন্ধ্যা", titleEn: "Morning-Evening" },
  ];

  console.log("Seeding indexes for 'Daily Life Duas'...");
  for (const idx of indexesData) {
    await prisma.duaIndex.upsert({
      where: {
        bookId_slug: {
          bookId: dailyLifeBook.id,
          slug: idx.slug,
        },
      },
      update: {
        titleBn: idx.titleBn,
        titleEn: idx.titleEn,
      },
      create: {
        bookId: dailyLifeBook.id,
        slug: idx.slug,
        titleBn: idx.titleBn,
        titleEn: idx.titleEn,
        status: DuaStatus.published,
      },
    });
  }

  // 5. Fetch required IDs for the Sample Dua Item
  const quranicIndex = await prisma.duaIndex.findUnique({
    where: {
      bookId_slug: {
        bookId: dailyLifeBook.id,
        slug: "quranic-dua",
      },
    },
  });

  const quranicCategory = await prisma.duaCategory.findUnique({
    where: { slug: "quranic-dua" },
  });

  if (!quranicIndex || !quranicCategory) {
    throw new Error("Could not find Index 'quranic-dua' or Category 'quranic-dua' to link sample item.");
  }

  // 6. Seed Sample Dua Item
  const sampleDuaSlug = "good-in-this-world-and-next";
  console.log("Seeding sample Dua item...");
  await prisma.duaItem.upsert({
    where: {
      indexId_slug: {
        indexId: quranicIndex.id,
        slug: sampleDuaSlug,
      },
    },
    update: {
      bookId: dailyLifeBook.id,
      categoryId: quranicCategory.id,
      titleBn: "দুনিয়া ও আখিরাতের কল্যাণের দুআ",
      titleEn: "Good in this world and the next",
      arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      banglaMeaning: "হে আমাদের রব, আমাদের দুনিয়ায় কল্যাণ দিন, আখিরাতেও কল্যাণ দিন এবং আগুনের শাস্তি থেকে রক্ষা করুন।",
      englishMeaning: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
      transliterationBn: "রব্বানা আতিনা ফিদ্দুনিয়া হাসানাতাও ওয়া ফিল আখিরাতি হাসানাতাও ওয়া ক্বিনা আযাবান নার।",
      transliterationEn: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
      referenceBn: "কুরআন ২:২০১",
      referenceEn: "Quran 2:201",
      repeatCount: 3,
      status: DuaStatus.published,
      isVisibleInApp: true,
    },
    create: {
      bookId: dailyLifeBook.id,
      indexId: quranicIndex.id,
      categoryId: quranicCategory.id,
      slug: sampleDuaSlug,
      titleBn: "দুনিয়া ও আখিরাতের কল্যাণের দুআ",
      titleEn: "Good in this world and the next",
      arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      banglaMeaning: "হে আমাদের রব, আমাদের দুনিয়ায় কল্যাণ দিন, আখিরাতেও কল্যাণ দিন এবং আগুনের শাস্তি থেকে রক্ষা করুন।",
      englishMeaning: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
      transliterationBn: "রব্বানা আতিনা ফিদ্দুনিয়া হাসানাতাও ওয়া ফিল আখিরাতি হাসানাতাও ওয়া ক্বিনা আযাবান নার।",
      transliterationEn: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
      referenceBn: "কুরআন ২:২০১",
      referenceEn: "Quran 2:201",
      repeatCount: 3,
      status: DuaStatus.published,
      isVisibleInApp: true,
    },
  });

  console.log("🎉 Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
