const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const siteTextKeys = [
  // Hero
  { key: "hero.title", headingAr: "نحو تجربة رقمية واحترافية أفضل", headingEn: "Towards a Better Digital & Professional Experience", bodyAr: "نصمم تجارب مستخدم مبتكرة. نطور مواقع احترافية نقدم استشارات رقمية، وندربك لتطوير مهاراتك التقنية والإبداعية", bodyEn: "We design innovative user experiences. We develop professional websites, provide digital consulting, and train you to develop your technical and creative skills" },
  { key: "hero.description", headingAr: "", headingEn: "", bodyAr: "", bodyEn: "" },
  { key: "hero.cta", headingAr: "ابدأ مشروعك الآن", headingEn: "Start Your Project Now", bodyAr: "اطلع على خدماتنا", bodyEn: "View Our Services" },

  // About
  { key: "about.main", headingAr: "محمد بن سواد", headingEn: "About Us", bodyAr: "شركة رائدة في التحول الرقمي", bodyEn: "A leading company in digital transformation" },
  { key: "about.vision", headingAr: "رؤيتنا", headingEn: "Our Vision", bodyAr: "", bodyEn: "" },
  { key: "about.mission", headingAr: "مهمتنا", headingEn: "Our Mission", bodyAr: "", bodyEn: "" },
  { key: "about.goals", headingAr: "أهدافنا", headingEn: "Our Goals", bodyAr: "", bodyEn: "" },
  { key: "about.values", headingAr: "قيمنا", headingEn: "Our Values", bodyAr: "", bodyEn: "" },

  // Services
  { key: "services.main", headingAr: "خدماتنا", headingEn: "Our Services", bodyAr: "نقدم مجموعة متكاملة من الخدمات الرقمية المصممة لتلبية احتياجات عملك وتحقيق أهدافك", bodyEn: "We offer a comprehensive range of digital services designed to meet your business needs and achieve your goals" },

  // Consultants
  { key: "consultants.main", headingAr: "الاستشاريين", headingEn: "Our Consultants", bodyAr: "في دافور لانس، نربطك بنخبة من المستقلين والاستشاريين لضمان نتائج عالية الجودة في أهم مجالات التقنية والأعمال.", bodyEn: "At Dafourlance, we connect you with an elite group of freelancers and consultants to ensure high-quality results in the most important areas of technology and business." },
  { key: "consultants.sub", headingAr: "الاستشاريين", headingEn: "CONSULTANTS", bodyAr: "", bodyEn: "" },

  // Projects
  { key: "projects.main", headingAr: "مشاريعنا المتميزة", headingEn: "Featured Projects", bodyAr: "نحن فخورون بتقديم حلول مبتكرة تلبي تطلعات عملائنا.", bodyEn: "We are proud to deliver innovative solutions that meet our aspirations." },
  { key: "projects.sub", headingAr: "سابقة الأعمال", headingEn: "OUR PORTFOLIO", bodyAr: "", bodyEn: "" },

  // Partners
  { key: "partners.main", headingAr: "شركاؤنا في النجاح", headingEn: "Our Success Partners", bodyAr: "نفخر بشراكاتنا الاستراتيجية مع نخبة من المؤسسات المحلية والعالمية التي تشاركنا الرؤية في تحقيق التميز والابتكار", bodyEn: "We are proud of our strategic partnerships with a selection of local and international institutions that share our vision of achieving excellence and innovation" },

  // Contact
  { key: "contact.main", headingAr: "تواصل معنا", headingEn: "Contact Us", bodyAr: "هو الخطوة الأولى نحو إنجاز مشروعك بنجاح", bodyEn: "is the first step towards completing your project successfully" },

  // Footer
  { key: "footer.main", headingAr: "دافور لانس", headingEn: "DaforLance", bodyAr: "شركة رائدة في التحول الرقمي تقدما حلولاً مبتكرة في تصميم الأعمال وتحقيق التحول الرقمي بأعلى معايير الجودة والابتكار", bodyEn: "A leading company in digital transformation providing innovative solutions in business design and achieving digital transformation with the highest standards of quality and innovation" },
]

async function main() {
  console.log("Creating SiteText records...")
  let created = 0
  let skipped = 0

  for (const item of siteTextKeys) {
    const existing = await prisma.siteText.findUnique({ where: { key: item.key } })
    if (existing) {
      console.log(`  ⏭ Skipped: ${item.key} (already exists)`)
      skipped++
    } else {
      await prisma.siteText.create({ data: item })
      console.log(`  ✅ Created: ${item.key}`)
      created++
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
