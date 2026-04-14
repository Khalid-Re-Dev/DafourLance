const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Starting comprehensive database seed...\n")

  // ─────────────────────────────────────────────────
  // 1. Admin User
  // ─────────────────────────────────────────────────
  console.log("👤 Seeding admin user...")
  const hashedPassword = await bcrypt.hash("Admin123!", 12)
  await prisma.user.upsert({
    where: { email: "admin@daforlance.com" },
    update: {},
    create: {
      email: "admin@daforlance.com",
      password: hashedPassword,
      name: "Super Admin",
      role: "admin",
    },
  })
  console.log("   ✅ Admin user ready")

  // ─────────────────────────────────────────────────
  // 2. Navigation Items
  // ─────────────────────────────────────────────────
  console.log("🧭 Seeding navigation items...")
  const navItems = [
    { id: "nav-1", labelAr: "الرئيسية", labelEn: "Home", href: "#", order: 1, isVisible: true, isExternal: false },
    { id: "nav-2", labelAr: "محمد بن سواد", labelEn: "About Us", href: "#about", order: 2, isVisible: true, isExternal: false },
    { id: "nav-3", labelAr: "خدماتنا", labelEn: "Services", href: "#services", order: 3, isVisible: true, isExternal: false },
    { id: "nav-4", labelAr: "الاستشاريين", labelEn: "Consultants", href: "#consultants", order: 4, isVisible: true, isExternal: false },
    { id: "nav-5", labelAr: "مشاريعنا", labelEn: "Projects", href: "#projects", order: 5, isVisible: true, isExternal: false },
    { id: "nav-6", labelAr: "تواصل معنا", labelEn: "Contact Us", href: "#contact", order: 6, isVisible: true, isExternal: false },
  ]
  for (const item of navItems) {
    await prisma.navItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    })
  }
  console.log(`   ✅ ${navItems.length} navigation items ready`)

  // ─────────────────────────────────────────────────
  // 3. Site Texts (CMS Content)
  // ─────────────────────────────────────────────────
  console.log("📝 Seeding site texts...")
  const siteTexts = [
    // Hero
    {
      id: "text-hero-title",
      key: "hero.title",
      headingAr: "محمد بن سواد",
      headingEn: "Towards a Better Digital & Professional Experience",
      bodyAr: "نصمم تجارب مستخدم مبتكرة. نطور مواقع احترافية نقدم استشارات رقمية، وندربك لتطوير مهاراتك التقنية والإبداعية",
      bodyEn: "We design innovative user experiences. We develop professional websites, provide digital consulting, and train you to develop your technical and creative skills",
    },
    {
      id: "text-hero-desc",
      key: "hero.description",
      headingAr: "",
      headingEn: "",
      bodyAr: "نصمم تجارب مستخدم مبتكرة. نطور مواقع احترافية نقدم استشارات رقمية، وندربك لتطوير مهاراتك التقنية والإبداعية",
      bodyEn: "We design innovative user experiences. We develop professional websites, provide digital consulting, and train you to develop your technical and creative skills",
    },
    {
      id: "text-hero-cta",
      key: "hero.cta",
      headingAr: "ابدأ مشروعك الآن",
      headingEn: "Start Your Project Now",
      bodyAr: "اطلع على خدماتنا",
      bodyEn: "View Our Services",
    },
    // About
    {
      id: "text-about",
      key: "about.main",
      headingAr: "محمد بن سواد",
      headingEn: "About Us",
      bodyAr: "دافور لانس فريق رقمي متخصص في تقديم حلول مبتكرة تمكن الشركات والمشاريع الناشئة من النمو والازدهار في العصر الرقمي.",
      bodyEn: "DaforLance is a digital team specialized in delivering innovative solutions that help companies and startups grow and thrive in the digital era.",
    },
    {
      id: "text-vision",
      key: "about.vision",
      headingAr: "رؤيتنا",
      headingEn: "Our Vision",
      bodyAr: "أن نصبح مزود الحلول الرقمية الرائد في المنطقة، معترفًا به للتميز والابتكار ورضا العملاء.",
      bodyEn: "To become the leading digital solutions provider in the region, recognized for excellence, innovation, and customer satisfaction.",
    },
    {
      id: "text-mission",
      key: "about.mission",
      headingAr: "رسالتنا",
      headingEn: "Our Mission",
      bodyAr: "تقديم حلول رقمية متقدمة تساعد الشركات على تحقيق أهدافها من خلال الابتكار والجودة والتفاني.",
      bodyEn: "Delivering advanced digital solutions that help companies achieve their goals through innovation, quality, and dedication.",
    },
    {
      id: "text-goals",
      key: "about.goals",
      headingAr: "أهدافنا",
      headingEn: "Our Goals",
      bodyAr: "تعزيز التعلم المستمر والتطوير المهني\nالحفاظ على أعلى معايير التميز التقني\nالمساهمة في التحول الرقمي\nبناء شراكات طويلة الأمد\nتقديم حلول مبتكرة",
      bodyEn: "Promoting continuous learning and professional development\nMaintaining the highest standards of technical excellence\nContributing to digital transformation\nBuilding long-term partnerships\nDelivering innovative solutions",
    },
    {
      id: "text-values",
      key: "about.values",
      headingAr: "قيمنا",
      headingEn: "Our Values",
      bodyAr: "الجودة، الالتزام، العمل الجماعي، الابتكار",
      bodyEn: "Quality, Commitment, Teamwork, Innovation",
    },
    // Services
    {
      id: "text-services",
      key: "services.main",
      headingAr: "خدماتنا",
      headingEn: "Our Services",
      bodyAr: "نقدم مجموعة متكاملة من الخدمات الرقمية المصممة لتلبية احتياجات عملك وتحقيق أهدافك",
      bodyEn: "We offer a comprehensive range of digital services designed to meet your business needs and achieve your goals",
    },
    // Consultants
    {
      id: "text-consultants",
      key: "consultants.main",
      headingAr: "الاستشاريين",
      headingEn: "Our Consultants",
      bodyAr: "في دافور لانس، نربطك بنخبة من المستقلين والاستشاريين لضمان نتائج عالية الجودة في أهم مجالات التقنية والأعمال.",
      bodyEn: "At Dafourlance, we connect you with an elite group of freelancers and consultants to ensure high-quality results in the most important areas of technology and business.",
    },
    {
      id: "text-consultants-sub",
      key: "consultants.sub",
      headingAr: "الاستشاريين",
      headingEn: "CONSULTANTS",
      bodyAr: "",
      bodyEn: "",
    },
    // Projects
    {
      id: "text-projects",
      key: "projects.main",
      headingAr: "مشاريعنا المتميزة",
      headingEn: "Featured Projects",
      bodyAr: "نحن فخورون بتقديم حلول مبتكرة تلبي تطلعات عملائنا.",
      bodyEn: "We are proud to deliver innovative solutions that meet our aspirations.",
    },
    {
      id: "text-projects-sub",
      key: "projects.sub",
      headingAr: "سابقة الأعمال",
      headingEn: "OUR PORTFOLIO",
      bodyAr: "",
      bodyEn: "",
    },
    // Partners
    {
      id: "text-partners",
      key: "partners.main",
      headingAr: "شركاؤنا في النجاح",
      headingEn: "Our Success Partners",
      bodyAr: "نفخر بشراكاتنا الاستراتيجية مع نخبة من المؤسسات المحلية والعالمية التي تشاركنا الرؤية في تحقيق التميز والابتكار",
      bodyEn: "We are proud of our strategic partnerships with a selection of local and international institutions that share our vision of achieving excellence and innovation",
    },
    // Contact
    {
      id: "text-contact",
      key: "contact.main",
      headingAr: "تواصل معنا",
      headingEn: "Contact Us",
      bodyAr: "هو الخطوة الأولى نحو إنجاز مشروعك بنجاح",
      bodyEn: "is the first step towards completing your project successfully",
    },
    // Footer
    {
      id: "text-footer",
      key: "footer.main",
      headingAr: "دافور لانس",
      headingEn: "DaforLance",
      bodyAr: "شركة رائدة في التحول الرقمي تقدما حلولاً مبتكرة في تصميم الأعمال وتحقيق التحول الرقمي بأعلى معايير الجودة والابتكار",
      bodyEn: "A leading company in digital transformation providing innovative solutions in business design and achieving digital transformation with the highest standards of quality and innovation",
    },
  ]
  for (const text of siteTexts) {
    await prisma.siteText.upsert({
      where: { key: text.key },
      update: {
        headingAr: text.headingAr,
        headingEn: text.headingEn,
        bodyAr: text.bodyAr,
        bodyEn: text.bodyEn,
      },
      create: text,
    })
  }
  console.log(`   ✅ ${siteTexts.length} site texts ready`)

  // ─────────────────────────────────────────────────
  // 4. Consultants
  // ─────────────────────────────────────────────────
  console.log("👥 Seeding consultants...")
  const consultants = [
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
      isActive: true,
    },
    {
      id: "cons-2",
      nameAr: "فهد أحمد",
      nameEn: "Fahd Ahmed",
      roleAr: "مصمم واجهة وتجربة المستخدم",
      roleEn: "UI/UX Designer",
      descriptionAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي",
      descriptionEn: "This text is an example of text that can be replaced in the same space",
      isFeatured: false,
      order: 2,
      isActive: true,
    },
    {
      id: "cons-3",
      nameAr: "حسن محمد",
      nameEn: "Hassan Mohammed",
      roleAr: "مصمم واجهة وتجربة المستخدم",
      roleEn: "UI/UX Designer",
      descriptionAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي",
      descriptionEn: "This text is an example of text that can be replaced in the same space",
      isFeatured: false,
      order: 3,
      isActive: true,
    },
    {
      id: "cons-4",
      nameAr: "محمد خالد",
      nameEn: "Mohammed Khaled",
      roleAr: "مصمم واجهة وتجربة المستخدم",
      roleEn: "UI/UX Designer",
      descriptionAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي",
      descriptionEn: "This text is an example of text that can be replaced in the same space",
      isFeatured: false,
      order: 4,
      isActive: true,
    },
  ]
  for (const cons of consultants) {
    await prisma.consultant.upsert({
      where: { id: cons.id },
      update: cons,
      create: cons,
    })
  }
  console.log(`   ✅ ${consultants.length} consultants ready`)

  // ─────────────────────────────────────────────────
  // 5. Projects
  // ─────────────────────────────────────────────────
  console.log("📁 Seeding projects...")
  const projects = [
    {
      id: "proj-1",
      titleAr: "منصة التجارة الإلكترونية",
      titleEn: "E-Commerce Platform",
      shortDescriptionAr: "متجر إلكتروني متكامل مع نظام دفع آمن وتجربة تسوق سلسة",
      shortDescriptionEn: "A complete online store with secure payment system and seamless shopping experience",
      categoryAr: "تطوير ويب",
      categoryEn: "Web Development",
      imageUrl: "/ecommerce-platform-dark-modern-interface.jpg",
      ctaLabelAr: "عرض التفاصيل",
      ctaLabelEn: "View Details",
      ctaLink: "#",
      order: 1,
      isActive: true,
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
      ctaLabelAr: "عرض التفاصيل",
      ctaLabelEn: "View Details",
      ctaLink: "#",
      order: 2,
      isActive: true,
    },
    {
      id: "proj-3",
      titleAr: "موقع الشركة التعريفي",
      titleEn: "Corporate Website",
      shortDescriptionAr: "موقع احترافي يعكس هوية الشركة ويعرض خدماتها بشكل مميز",
      shortDescriptionEn: "Professional website that reflects the company identity",
      categoryAr: "تصميم UI/UX",
      categoryEn: "UI/UX Design",
      imageUrl: "/corporate-website-modern-sleek-design.jpg",
      ctaLabelAr: "عرض التفاصيل",
      ctaLabelEn: "View Details",
      ctaLink: "#",
      order: 3,
      isActive: true,
    },
    {
      id: "proj-4",
      titleAr: "لوحة تحكم تحليلية",
      titleEn: "Analytics Dashboard",
      shortDescriptionAr: "لوحة تحكم متقدمة لتحليل البيانات وعرض الإحصائيات بشكل مرئي",
      shortDescriptionEn: "Advanced dashboard for data analysis and visual statistics",
      categoryAr: "تحليل بيانات",
      categoryEn: "Data Analytics",
      imageUrl: "/analytics-dashboard-charts-graphs-dark-theme.jpg",
      ctaLabelAr: "عرض التفاصيل",
      ctaLabelEn: "View Details",
      ctaLink: "#",
      order: 4,
      isActive: true,
    },
  ]
  for (const proj of projects) {
    await prisma.project.upsert({
      where: { id: proj.id },
      update: proj,
      create: proj,
    })
  }
  console.log(`   ✅ ${projects.length} projects ready`)

  // ─────────────────────────────────────────────────
  // 6. Partners
  // ─────────────────────────────────────────────────
  console.log("🤝 Seeding partners...")
  const partners = [
    { id: "part-1", nameAr: "قوفي", nameEn: "Qufi", logoUrl: "/placeholder-logo.svg", order: 1, isActive: true },
    { id: "part-2", nameAr: "عبدالصمد القرشي", nameEn: "Abdul Samad Al Qurashi", logoUrl: "/placeholder-logo.svg", order: 2, isActive: true },
    { id: "part-3", nameAr: "بلانكو", nameEn: "BLANCO", logoUrl: "/placeholder-logo.svg", order: 3, isActive: true },
    { id: "part-4", nameAr: "نينتندو", nameEn: "Nintendo", logoUrl: "/placeholder-logo.svg", order: 4, isActive: true },
    { id: "part-5", nameAr: "ميني سو", nameEn: "Miniso", logoUrl: "/placeholder-logo.svg", order: 5, isActive: true },
  ]
  for (const partner of partners) {
    await prisma.partner.upsert({
      where: { id: partner.id },
      update: partner,
      create: partner,
    })
  }
  console.log(`   ✅ ${partners.length} partners ready`)

  // ─────────────────────────────────────────────────
  // 7. Footer Config
  // ─────────────────────────────────────────────────
  console.log("📋 Seeding footer config...")
  const footerData = {
    id: "footer-default",
    phone: "+967 774071453",
    phone2: "+967 774071453",
    email: "email@email.com",
    whatsapp: "+967 774071453",
    addressAr: "اليمن - صنعاء",
    addressEn: "Yemen - Sana'a",
    descriptionAr: "شركة رائدة في التحول الرقمي تقدما حلولاً مبتكرة في تصميم الأعمال وتحقيق التحول الرقمي بأعلى معايير الجودة والابتكار",
    descriptionEn: "A leading company in digital transformation providing innovative solutions in business design and achieving digital transformation with the highest standards of quality and innovation",
    copyrightAr: "جميع الحقوق محفوظة © 2025 دافور لحلول التقنية المحدودة",
    copyrightEn: "All rights reserved © 2025 Dafour Technology Solutions Ltd",
    isActive: true,
  }
  await prisma.footerConfig.upsert({
    where: { id: footerData.id },
    update: footerData,
    create: footerData,
  })
  console.log("   ✅ Footer config ready")

  // ─────────────────────────────────────────────────
  // 8. Contact Info
  // ─────────────────────────────────────────────────
  console.log("📞 Seeding contact info...")
  const contactData = {
    id: "contact-default",
    phone: "+967 774071453",
    phone2: "+967 774071453",
    email: "email@email.com",
    whatsapp: "+967 774071453",
    addressAr: "اليمن - صنعاء",
    addressEn: "Yemen - Sana'a",
    titleAr: "تواصل معنا",
    titleEn: "Contact Us",
    subtitleAr: "نحن هنا للإجابة على استفساراتك",
    subtitleEn: "We are here to answer your inquiries",
    isActive: true,
  }
  await prisma.contactInfo.upsert({
    where: { id: contactData.id },
    update: contactData,
    create: contactData,
  })
  console.log("   ✅ Contact info ready")

  // ─────────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────────
  console.log("\n" + "═".repeat(50))
  console.log("✅ DATABASE SEED COMPLETED SUCCESSFULLY!")
  console.log("═".repeat(50))
  console.log(`   👤 Users:        ${await prisma.user.count()}`)
  console.log(`   🧭 Nav Items:    ${await prisma.navItem.count()}`)
  console.log(`   📝 Site Texts:   ${await prisma.siteText.count()}`)
  console.log(`   👥 Consultants:  ${await prisma.consultant.count()}`)
  console.log(`   📁 Projects:     ${await prisma.project.count()}`)
  console.log(`   🤝 Partners:     ${await prisma.partner.count()}`)
  console.log(`   📋 Footer:       ${await prisma.footerConfig.count()}`)
  console.log(`   📞 Contact:      ${await prisma.contactInfo.count()}`)
  console.log("═".repeat(50) + "\n")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
