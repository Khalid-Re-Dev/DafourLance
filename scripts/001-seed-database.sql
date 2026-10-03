-- Seed initial admin user (password: admin123 - hashed with bcrypt)
-- In production, change this password immediately

-- Seed navigation items
INSERT INTO NavItem (id, labelAr, labelEn, href, "order", isVisible, isExternal, createdAt, updatedAt) VALUES
('nav-1', 'الرئيسية', 'Home', '#', 1, 1, 0, datetime('now'), datetime('now')),
('nav-2', 'من نحن', 'About Us', '#about', 2, 1, 0, datetime('now'), datetime('now')),
('nav-3', 'خدماتنا', 'Services', '#services', 3, 1, 0, datetime('now'), datetime('now')),
('nav-4', 'الاستشاريين', 'Consultants', '#consultants', 4, 1, 0, datetime('now'), datetime('now')),
('nav-5', 'مشاريعنا', 'Projects', '#projects', 5, 1, 0, datetime('now'), datetime('now')),
('nav-6', 'تواصل معنا', 'Contact Us', '#contact', 6, 1, 0, datetime('now'), datetime('now'));

-- Seed consultants
INSERT INTO Consultant (id, nameAr, nameEn, roleAr, roleEn, descriptionAr, descriptionEn, imageUrl, isFeatured, "order", isActive, createdAt, updatedAt) VALUES
('cons-1', 'محمد عبدالرحيم', 'Mohammed Abdulrahim', 'مصمم واجهة وتجربة المستخدم', 'UI/UX Designer', 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي', 'This text is an example of text that can be replaced in the same space', NULL, 1, 1, 1, datetime('now'), datetime('now')),
('cons-2', 'فهد أحمد', 'Fahd Ahmed', 'مصمم واجهة وتجربة المستخدم', 'UI/UX Designer', 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي', 'This text is an example of text that can be replaced in the same space', NULL, 0, 2, 1, datetime('now'), datetime('now')),
('cons-3', 'حسن محمد', 'Hassan Mohammed', 'مصمم واجهة وتجربة المستخدم', 'UI/UX Designer', 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي', 'This text is an example of text that can be replaced in the same space', NULL, 0, 3, 1, datetime('now'), datetime('now')),
('cons-4', 'محمد خالد', 'Mohammed Khaled', 'مصمم واجهة وتجربة المستخدم', 'UI/UX Designer', 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي', 'This text is an example of text that can be replaced in the same space', NULL, 0, 4, 1, datetime('now'), datetime('now'));

-- Seed projects
INSERT INTO Project (id, titleAr, titleEn, shortDescriptionAr, shortDescriptionEn, categoryAr, categoryEn, imageUrl, ctaLabelAr, ctaLabelEn, ctaLink, "order", isActive, createdAt, updatedAt) VALUES
('proj-1', 'منصة التجارة الإلكترونية', 'E-Commerce Platform', 'متجر إلكتروني متكامل مع نظام دفع آمن وتجربة تسوق سلسة', 'A complete online store with secure payment system and seamless shopping experience', 'تطوير ويب', 'Web Development', '/ecommerce-platform-dark-modern-interface.jpg', 'عرض التفاصيل', 'View Details', '#', 1, 1, datetime('now'), datetime('now')),
('proj-2', 'تطبيق إدارة المهام', 'Task Management App', 'تطبيق ذكي لإدارة المشاريع والمهام بواجهة عصرية وسهلة', 'Smart application for managing projects and tasks with a modern interface', 'تطبيقات', 'Applications', '/task-management-app-colorful-ui-dashboard.jpg', 'عرض التفاصيل', 'View Details', '#', 2, 1, datetime('now'), datetime('now')),
('proj-3', 'موقع الشركة التعريفي', 'Corporate Website', 'موقع احترافي يعكس هوية الشركة ويعرض خدماتها بشكل مميز', 'Professional website that reflects the company identity', 'تصميم UI/UX', 'UI/UX Design', '/corporate-website-modern-sleek-design.jpg', 'عرض التفاصيل', 'View Details', '#', 3, 1, datetime('now'), datetime('now')),
('proj-4', 'لوحة تحكم تحليلية', 'Analytics Dashboard', 'لوحة تحكم متقدمة لتحليل البيانات وعرض الإحصائيات بشكل مرئي', 'Advanced dashboard for data analysis and visual statistics', 'تحليل بيانات', 'Data Analytics', '/analytics-dashboard-charts-graphs-dark-theme.jpg', 'عرض التفاصيل', 'View Details', '#', 4, 1, datetime('now'), datetime('now'));

-- Seed partners
INSERT INTO Partner (id, nameAr, nameEn, logoUrl, websiteUrl, "order", isActive, createdAt, updatedAt) VALUES
('part-1', 'قوفي', 'Qufi', '/placeholder-logo.svg', NULL, 1, 1, datetime('now'), datetime('now')),
('part-2', 'عبدالصمد القرشي', 'Abdul Samad Al Qurashi', '/placeholder-logo.svg', NULL, 2, 1, datetime('now'), datetime('now')),
('part-3', 'بلانكو', 'BLANCO', '/placeholder-logo.svg', NULL, 3, 1, datetime('now'), datetime('now')),
('part-4', 'نينتندو', 'Nintendo', '/placeholder-logo.svg', NULL, 4, 1, datetime('now'), datetime('now')),
('part-5', 'ميني سو', 'Miniso', '/placeholder-logo.svg', NULL, 5, 1, datetime('now'), datetime('now'));

-- Seed site texts
INSERT INTO SiteText (id, "key", headingAr, headingEn, bodyAr, bodyEn, extraJson, createdAt, updatedAt) VALUES
('text-hero-title', 'hero.title', 'نحو تجربة رقمية واحترافية أفضل', 'Towards a Better Digital & Professional Experience', NULL, NULL, NULL, datetime('now'), datetime('now')),
('text-hero-desc', 'hero.description', NULL, NULL, 'نصمم تجارب مستخدم مبتكرة. نطور مواقع احترافية نقدم استشارات رقمية، وندربك لتطوير مهاراتك التقنية والإبداعية', 'We design innovative user experiences. We develop professional websites, provide digital consulting, and train you to develop your technical and creative skills', NULL, datetime('now'), datetime('now')),
('text-hero-cta', 'hero.cta', 'ابدأ مشروعك الآن', 'Start Your Project Now', 'اطلع على خدماتنا', 'View Our Services', NULL, datetime('now'), datetime('now')),
('text-about', 'about.main', 'محمد بن سواد', 'About Us', 'دافور لانس فريق رقمي متخصص في تقديم حلول مبتكرة تمكن الشركات والمشاريع الناشئة من النمو والازدهار في العصر الرقمي.', 'DaforLance is a digital team specialized in delivering innovative solutions that help companies and startups grow and thrive in the digital era.', NULL, datetime('now'), datetime('now')),
('text-vision', 'about.vision', 'رؤيتنا', 'Our Vision', 'أن نصبح مزود الحلول الرقمية الرائد في المنطقة، معترفًا به للتميز والابتكار ورضا العملاء.', 'To become the leading digital solutions provider in the region, recognized for excellence, innovation, and customer satisfaction.', NULL, datetime('now'), datetime('now')),
('text-mission', 'about.mission', 'رسالتنا', 'Our Mission', 'تقديم حلول رقمية متقدمة تساعد الشركات على تحقيق أهدافها من خلال الابتكار والجودة والتفاني.', 'Delivering advanced digital solutions that help companies achieve their goals through innovation, quality, and dedication.', NULL, datetime('now'), datetime('now')),
('text-goals', 'about.goals', 'أهدافنا', 'Our Goals', 'تعزيز التعلم المستمر والتطوير المهني\nالحفاظ على أعلى معايير التميز التقني\nالمساهمة في التحول الرقمي\nبناء شراكات طويلة الأمد\nتقديم حلول مبتكرة', 'Promoting continuous learning and professional development\nMaintaining the highest standards of technical excellence\nContributing to digital transformation\nBuilding long-term partnerships\nDelivering innovative solutions', NULL, datetime('now'), datetime('now')),
('text-values', 'about.values', 'قيمنا', 'Our Values', 'الجودة، الالتزام، العمل الجماعي، الابتكار', 'Quality, Commitment, Teamwork, Innovation', NULL, datetime('now'), datetime('now')),
('text-services', 'services.main', 'خدماتنا', 'Our Services', 'نقدم مجموعة متكاملة من الخدمات الرقمية المصممة لتلبية احتياجات عملك وتحقيق أهدافك', 'We offer a comprehensive range of digital services designed to meet your business needs and achieve your goals', NULL, datetime('now'), datetime('now')),
('text-consultants', 'consultants.main', 'الاستشاريين', 'Our Consultants', 'في دافور لانس، نربطك بنخبة من المستقلين والاستشاريين لضمان نتائج عالية الجودة في أهم مجالات التقنية والأعمال.', 'At Dafourlance, we connect you with an elite group of freelancers and consultants to ensure high-quality results in the most important areas of technology and business.', NULL, datetime('now'), datetime('now')),
('text-projects', 'projects.main', 'مشاريعنا', 'Our Projects', 'يعرض قسم المشاريع أحدث حلولنا الرقمية المبتكرة التي تحول الأفكار إلى نتائج ملموسة', 'The projects section showcases our latest innovative digital solutions that transform ideas into tangible results', NULL, datetime('now'), datetime('now')),
('text-partners', 'partners.main', 'شركاؤنا في النجاح', 'Our Success Partners', 'نفخر بشراكاتنا الاستراتيجية مع نخبة من المؤسسات المحلية والعالمية التي تشاركنا الرؤية في تحقيق التميز والابتكار', 'We are proud of our strategic partnerships with a selection of local and international institutions that share our vision of achieving excellence and innovation', NULL, datetime('now'), datetime('now')),
('text-contact', 'contact.main', 'تواصل معنا', 'Contact Us', 'احجز موعد هو الخطوة الأولى نحو إنجاز مشروعك بنجاح', 'Book an appointment is the first step towards completing your project successfully', NULL, datetime('now'), datetime('now')),
('text-footer', 'footer.main', NULL, NULL, 'شركة رائدة في التحول الرقمي تقدما حلولاً مبتكرة في تصميم الأعمال وتحقيق التحول الرقمي بأعلى معايير الجودة والابتكار', 'A leading company in digital transformation providing innovative solutions in business design and achieving digital transformation with the highest standards of quality and innovation', NULL, datetime('now'), datetime('now'));
