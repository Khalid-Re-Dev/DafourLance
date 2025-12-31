import { translations } from "@/lib/i18n/translations"

// Static knowledge base builder using the translations and component data
// This avoids Prisma dependency issues in the v0 preview environment

export function buildKnowledgeBase(language: "ar" | "en"): string {
  const t = translations[language]
  const isArabic = language === "ar"

  const sections: string[] = []

  // About DaforLance
  sections.push(`[SECTION] ${isArabic ? "عن دافور لانس" : "About DaforLance"}
${
  isArabic
    ? "دافور لانس فريق رقمي متخصص في تقديم حلول مبتكرة تمكن الشركات والمشاريع الناشئة من النمو والازدهار في العصر الرقمي."
    : "DaforLance is a digital team specialized in delivering innovative solutions that help companies and startups grow and thrive in the digital era."
}
${t.hero.description}`)

  // Vision
  sections.push(`[SECTION] ${isArabic ? "رؤيتنا" : "Our Vision"}
${
  isArabic
    ? "أن نصبح مزود الحلول الرقمية الرائد في المنطقة، معترفًا به للتميز والابتكار ورضا العملاء."
    : "To become the leading digital solutions provider in the region, recognized for excellence, innovation, and customer satisfaction."
}`)

  // Mission
  sections.push(`[SECTION] ${isArabic ? "رسالتنا" : "Our Mission"}
${
  isArabic
    ? "تقديم حلول رقمية متقدمة تساعد الشركات على تحقيق أهدافها من خلال الابتكار والجودة والتفاني."
    : "To deliver advanced digital solutions that help companies achieve their goals through innovation, quality, and dedication."
}`)

  // Goals
  const goals = isArabic
    ? [
        "تعزيز التعلم المستمر والتطوير المهني",
        "الحفاظ على أعلى معايير التميز التقني",
        "المساهمة في التحول الرقمي",
        "بناء شراكات طويلة الأمد",
        "تقديم حلول مبتكرة",
      ]
    : [
        "Promote continuous learning and professional development",
        "Maintain the highest standards of technical excellence",
        "Contribute to digital transformation",
        "Build long-term partnerships",
        "Deliver innovative solutions",
      ]

  sections.push(`[SECTION] ${isArabic ? "أهدافنا" : "Our Goals"}
${goals.map((g, i) => `- ${isArabic ? "هدف" : "Goal"} ${i + 1}: ${g}`).join("\n")}`)

  // Values
  const values = isArabic
    ? ["الجودة", "الالتزام", "العمل الجماعي", "الابتكار"]
    : ["Quality", "Commitment", "Teamwork", "Innovation"]

  sections.push(`[SECTION] ${isArabic ? "قيمنا" : "Our Values"}
${values.map((v) => `- ${v}`).join("\n")}`)

  // Services
  const services = isArabic
    ? [
        {
          title: "تطوير المواقع",
          description: "نبني مواقع احترافية متجاوبة باستخدام أحدث التقنيات لضمان أداء مثالي وتجربة مستخدم سلسة",
        },
        {
          title: "تصميم واجهات المستخدم",
          description: "نصمم واجهات جذابة وسهلة الاستخدام تعكس هوية علامتك التجارية وتحقق أهدافك",
        },
        {
          title: "التسويق الرقمي",
          description: "استراتيجيات تسويقية متكاملة لزيادة الوعي بعلامتك التجارية والوصول لجمهورك المستهدف",
        },
        {
          title: "التدريب والتأهيل",
          description: "برامج تدريبية متخصصة لتطوير مهاراتك التقنية والإبداعية في مجال التقنية",
        },
        {
          title: "الاستشارات الرقمية",
          description: "نقدم استشارات متخصصة لمساعدتك في التحول الرقمي واتخاذ القرارات التقنية الصحيحة",
        },
        {
          title: "تحليل البيانات",
          description: "نحلل بياناتك لاستخراج رؤى قيمة تساعدك في اتخاذ قرارات مدروسة وتحسين الأداء",
        },
      ]
    : [
        {
          title: "Web Development",
          description:
            "We build professional responsive websites using the latest technologies to ensure optimal performance and seamless user experience",
        },
        {
          title: "UI/UX Design",
          description:
            "We design attractive and easy-to-use interfaces that reflect your brand identity and achieve your goals",
        },
        {
          title: "Digital Marketing",
          description: "Integrated marketing strategies to increase brand awareness and reach your target audience",
        },
        {
          title: "Training & Development",
          description:
            "Specialized training programs to develop your technical and creative skills in the technology field",
        },
        {
          title: "Digital Consulting",
          description:
            "We provide specialized consultations to help you with digital transformation and make the right technical decisions",
        },
        {
          title: "Data Analytics",
          description:
            "We analyze your data to extract valuable insights that help you make informed decisions and improve performance",
        },
      ]

  sections.push(`[SECTION] ${t.services.title}
${t.services.description}
${isArabic ? "الخدمات المتوفرة:" : "Available Services:"}
${services.map((s) => `- ${s.title}: ${s.description}`).join("\n")}`)

  // Consultants
  const consultants = isArabic
    ? [
        { name: "محمد عبدالرحيم", role: "مصمم واجهة وتجربة المستخدم" },
        { name: "فهد أحمد", role: "مصمم واجهة وتجربة المستخدم" },
        { name: "حسن محمد", role: "مصمم واجهة وتجربة المستخدم" },
        { name: "محمد خالد", role: "مصمم واجهة وتجربة المستخدم" },
      ]
    : [
        { name: "Mohammed Abdulrahim", role: "UI/UX Designer" },
        { name: "Fahd Ahmed", role: "UI/UX Designer" },
        { name: "Hassan Mohammed", role: "UI/UX Designer" },
        { name: "Mohammed Khaled", role: "UI/UX Designer" },
      ]

  sections.push(`[SECTION] ${t.consultants.title}
${t.consultants.description}
${isArabic ? "فريق الاستشاريين:" : "Our Consultants Team:"}
${consultants.map((c) => `- ${c.name}: ${c.role}`).join("\n")}`)

  // Projects
  sections.push(`[SECTION] ${t.projects.title}
${t.projects.description}
${
  isArabic
    ? "لدينا العديد من المشاريع الناجحة في مجالات تطوير المواقع، تصميم التطبيقات، والحلول الرقمية المتكاملة."
    : "We have many successful projects in web development, app design, and integrated digital solutions."
}`)

  // Partners
  sections.push(`[SECTION] ${t.partners.title}
${t.partners.description}
${
  isArabic
    ? "نفتخر بشراكاتنا مع شركات محلية وعالمية رائدة مثل: Nintendo، Blanco، Abdul Samad Al Qurashi، Kinza، Alamoudi Oud، Assaf، وغيرها."
    : "We are proud of our partnerships with leading local and international companies such as: Nintendo, Blanco, Abdul Samad Al Qurashi, Kinza, Alamoudi Oud, Assaf, and others."
}`)

  // Contact Information
  sections.push(`[SECTION] ${t.contact.title}
${isArabic ? "معلومات التواصل:" : "Contact Information:"}
- ${isArabic ? "الهاتف" : "Phone"}: +967 777000000
- ${isArabic ? "واتساب" : "WhatsApp"}: +967 777000000
- ${isArabic ? "البريد الإلكتروني" : "Email"}: email@email.com
- ${isArabic ? "يمكنك حجز موعد من خلال نموذج التواصل في الموقع" : "You can book an appointment through the contact form on the website"}`)

  // Footer info
  sections.push(`[SECTION] ${isArabic ? "معلومات الشركة" : "Company Information"}
${t.footer.description}
${t.footer.copyright}`)

  return sections.join("\n\n")
}

export function getSystemPrompt(language: "ar" | "en"): string {
  const isArabic = language === "ar"

  return isArabic
    ? `أنت المساعد الذكي الرسمي لموقع دافور لانس (DaforLance).

يجب أن تجيب بدقة وحصرياً باستخدام محتوى الموقع المُقدم لك في قسم "CONTEXT" أدناه.

إذا سأل المستخدم عن أي شيء غير موجود في السياق (خدمات لا نقدمها، أسعار غير مدرجة، تقنيات غير مذكورة، إلخ)، يجب أن تقول بوضوح أنك غير متأكد وتقترح التواصل مع فريق دافور لانس عبر واتساب أو نموذج التواصل.

لا تختلق أبداً خدمات أو ميزات أو أرقام أو ضمانات غير موجودة صراحة في السياق.

أجب دائماً بنفس لغة سؤال المستخدم (عربي أو إنجليزي).

كن ودوداً ومهنياً ومختصراً في إجاباتك.`
    : `You are the official AI assistant for the DaforLance website.

You MUST answer strictly and only using the website content provided to you in the "CONTEXT" section below.

If the user asks about anything that is not covered in the context (services we don't offer, prices that are not listed, technologies not mentioned, etc.), you MUST say you are not sure and suggest contacting the DaforLance team via WhatsApp or the contact form.

Never invent services, features, numbers or guarantees that are not explicitly in the context.

Always respond in the same language as the user's question (Arabic or English).

Be friendly, professional, and concise in your responses.`
}
