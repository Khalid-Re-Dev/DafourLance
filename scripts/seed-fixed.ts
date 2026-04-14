import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  // Seed navigation items
  console.log("Seeding navigation items...")
  await prisma.navItem.createMany({
    data: [
      { id: "nav-1", labelAr: "الرئيسية", labelEn: "Home", href: "#", order: 1, isVisible: true },
      { id: "nav-2", labelAr: "محمد بن سواد", labelEn: "About Us", href: "#about", order: 2, isVisible: true },
      { id: "nav-3", labelAr: "خدماتنا", labelEn: "Services", href: "#services", order: 3, isVisible: true },
      { id: "nav-4", labelAr: "الاستشاريين", labelEn: "Consultants", href: "#consultants", order: 4, isVisible: true },
      { id: "nav-5", labelAr: "مشاريعنا", labelEn: "Projects", href: "#projects", order: 5, isVisible: true },
      { id: "nav-6", labelAr: "تواصل معنا", labelEn: "Contact Us", href: "#contact", order: 6, isVisible: true },
    ],
    skipDuplicates: true,
  })

  // Seed consultants
  console.log("Seeding consultants...")
  await prisma.consultant.createMany({
    data: [
      {
        id: "cons-1",
        nameAr: "محمد عبدالرحيم",
        nameEn: "Mohammed Abdulrahim",
        roleAr: "مصمم واجهة وتجربة المستخدم",
        roleEn: "UI/UX Designer",
        descriptionAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي",
        descriptionEn: "This text is an example of text that can be replaced in the same space",
        isFeatured: true,
        order: 1,
      },
      {
        id: "cons-2",
        nameAr: "فهد أحمد",
        nameEn: "Fahd Ahmed",
        roleAr: "مصمم واجهة وتجربة المستخدم",
        roleEn: "UI/UX Designer",
        descriptionAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي",
        descriptionEn: "This text is an example of text that can be replaced in the same space",
        order: 2,
      },
      {
        id: "cons-3",
        nameAr: "حسن محمد",
        nameEn: "Hassan Mohammed",
        roleAr: "مصمم واجهة وتجربة المستخدم",
        roleEn: "UI/UX Designer",
        descriptionAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي",
        descriptionEn: "This text is an example of text that can be replaced in the same space",
        order: 3,
      },
    ],
    skipDuplicates: true,
  })

  // Seed projects
  console.log("Seeding projects...")
  await prisma.project.createMany({
    data: [
      {
        id: "proj-1",
        titleAr: "منصة التجارة الإلكترونية",
        titleEn: "E-Commerce Platform",
        shortDescriptionAr: "متجر إلكتروني متكامل مع نظام دفع آمن وتجربة تسوق سلسة",
        shortDescriptionEn: "A complete online store with secure payment system and seamless shopping experience",
        categoryAr: "تطوير ويب",
        categoryEn: "Web Development",
        imageUrl: "/ecommerce-platform-dark-modern-interface.jpg",
        order: 1,
      },
      {
        id: "proj-2",
        titleAr: "تطبيق إدارة المهام",
        titleEn: "Task Management App",
        shortDescriptionAr: "تطبيق ذكي لإدارة المشاريع والمهام بواجهة عصرية وسهلة",
        shortDescriptionEn: "Smart application for managing projects and tasks with a modern interface",
        categoryAr: "تطبيقات",
        categoryEn: "Applications",
        imageUrl: "/task-management-app-colorful-ui-dashboard.jpg",
        order: 2,
      },
    ],
    skipDuplicates: true,
  })

  // Seed partners
  console.log("Seeding partners...")
  await prisma.partner.createMany({
    data: [
      { id: "part-1", nameAr: "قوفي", nameEn: "Qufi", logoUrl: "/placeholder-logo.svg", order: 1 },
      { id: "part-2", nameAr: "عبدالصمد القرشي", nameEn: "Abdul Samad Al Qurashi", logoUrl: "/placeholder-logo.svg", order: 2 },
      { id: "part-3", nameAr: "بلانكو", nameEn: "BLANCO", logoUrl: "/placeholder-logo.svg", order: 3 },
    ],
    skipDuplicates: true,
  })

  // Seed site texts
  console.log("Seeding site texts...")
  await prisma.siteText.createMany({
    data: [
      {
        id: "text-hero-title",
        key: "hero.title",
        headingAr: "نحو تجربة رقمية واحترافية أفضل",
        headingEn: "Towards a Better Digital & Professional Experience",
      },
      {
        id: "text-hero-desc",
        key: "hero.description",
        bodyAr: "نصمم تجارب مستخدم مبتكرة. نطور مواقع احترافية نقدم استشارات رقمية، وندربك لتطوير مهاراتك التقنية والإبداعية",
        bodyEn: "We design innovative user experiences. We develop professional websites, provide digital consulting, and train you to develop your technical and creative skills",
      },
      {
        id: "text-about",
        key: "about.main",
        headingAr: "محمد بن سواد",
        headingEn: "About Us",
        bodyAr: "دافور لانس فريق رقمي متخصص في تقديم حلول مبتكرة تمكن الشركات والمشاريع الناشئة من النمو والازدهار في العصر الرقمي.",
        bodyEn: "DaforLance is a digital team specialized in delivering innovative solutions that help companies and startups grow and thrive in the digital era.",
      },
      {
        id: "text-services",
        key: "services.main",
        headingAr: "خدماتنا",
        headingEn: "Our Services",
        bodyAr: "نقدم مجموعة متكاملة من الخدمات الرقمية المصممة لتلبية احتياجات عملك وتحقيق أهدافك",
        bodyEn: "We offer a comprehensive range of digital services designed to meet your business needs and achieve your goals",
      },
      {
        id: "text-consultants",
        key: "consultants.main",
        headingAr: "الاستشاريين",
        headingEn: "Our Consultants",
        bodyAr: "في دافور لانس، نربطك بنخبة من المستقلين والاستشاريين لضمان نتائج عالية الجودة",
        bodyEn: "At Dafourlance, we connect you with an elite group of freelancers and consultants to ensure high-quality results",
      },
      {
        id: "text-projects",
        key: "projects.main",
        headingAr: "مشاريعنا",
        headingEn: "Our Projects",
        bodyAr: "يعرض قسم المشاريع أحدث حلولنا الرقمية المبتكرة التي تحول الأفكار إلى نتائج ملموسة",
        bodyEn: "The projects section showcases our latest innovative digital solutions that transform ideas into tangible results",
      },
      {
        id: "text-partners",
        key: "partners.main",
        headingAr: "شركاؤنا في النجاح",
        headingEn: "Our Success Partners",
        bodyAr: "نفخر بشراكاتنا الاستراتيجية مع نخبة من المؤسسات المحلية والعالمية",
        bodyEn: "We are proud of our strategic partnerships with a selection of local and international institutions",
      },
      {
        id: "text-contact",
        key: "contact.main",
        headingAr: "تواصل معنا",
        headingEn: "Contact Us",
        bodyAr: "احجز موعد هو الخطوة الأولى نحو إنجاز مشروعك بنجاح",
        bodyEn: "Book an appointment is the first step towards completing your project successfully",
      },
    ],
    skipDuplicates: true,
  })

  console.log("\n✅ Database seeded successfully!")
  console.log("\nSummary:")
  console.log(`- Navigation items: ${await prisma.navItem.count()}`)
  console.log(`- Consultants: ${await prisma.consultant.count()}`)
  console.log(`- Projects: ${await prisma.project.count()}`)
  console.log(`- Partners: ${await prisma.partner.count()}`)
  console.log(`- Site texts: ${await prisma.siteText.count()}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
