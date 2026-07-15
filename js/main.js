/* ==========================================================================
   Elite Dental Lab — main.js
   Handles: EN/ES translations, desktop/mobile view toggle, service tabs,
   mobile navigation menu, and the contact form (mailto for now).
   ========================================================================== */

/* ---------------- Translations ---------------- */

const I18N = {
  en: {
    "util.view": "View:",
    "util.desktop": "Desktop",
    "util.mobile": "Mobile",

    "nav.about": "About",
    "nav.services": "Services",
    "nav.work": "Our Work",
    "nav.send": "Send a Case",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.cta": "Start a Case",

    "hero.eyebrow": "Full-service digital dental laboratory · Cockeysville, MD",
    "hero.title": "Precision restorations. Designed digitally, finished by hand.",
    "hero.sub": "For over 25 years, Elite Dental Lab has partnered with dentists to restore healthy, natural-looking smiles. Every case is scanned, designed, milled and layered under one roof — proudly made in the USA.",
    "hero.cta1": "Send Us a Case",
    "hero.cta2": "Explore Services",
    "hero.point1": "In-house production, start to finish",
    "hero.point2": "FDA-approved materials only",
    "hero.point3": "All major scanners & implant systems supported",
    "hero.badgeTop": "Made in USA",
    "hero.badgeBottom": "All final products",

    "ph.heroMedia": "Your hero image or video goes here",
    "ph.photo": "Photo placeholder",
    "ph.case": "Case photo",
    "ph.quote": "Testimonial text will go here. Replace with a real quote from one of your doctors.",
    "ph.docName": "Doctor's name",
    "ph.docPractice": "Practice name, City",
    "ph.map": "Map placeholder — embed Google Maps here",

    "stats.years": "Years of experience",
    "stats.inhouse": "In-house production",
    "stats.usaNum": "USA",
    "stats.usa": "All products made in America",
    "stats.fdaNum": "FDA",
    "stats.fda": "Approved materials only",

    "about.eyebrow": "Why Elite",
    "about.title": "Restorative work without the trade-offs",
    "about.sub": "We built a lab where modern digital tools and old-school craftsmanship work together — so you get consistent fits, lifelike esthetics, and a team that treats your patients like our own.",
    "about.c1t": "Everything under one roof",
    "about.c1p": "Scanning, design, milling and porcelain layering are all performed in our own facility. No outsourcing means tighter quality control and dependable turnaround.",
    "about.c2t": "A truly digital workflow",
    "about.c2p": "We accept files from every major intraoral scanner and design cases in 3Shape — keeping your workflow fast, accurate and remake-free.",
    "about.c3t": "Only proven materials",
    "about.c3p": "We work exclusively with FDA-approved materials from trusted manufacturers, so every restoration is as safe and durable as it is beautiful.",
    "about.c4t": "A partner, not just a lab",
    "about.c4p": "From case planning consultations to custom shade matching, our technicians are available to talk through your cases and help you get the outcome you want.",

    "services.eyebrow": "What we make",
    "services.title": "A complete range of restorations",
    "services.sub": "From single-unit crowns to full-arch implant cases, everything is crafted with the same attention to fit, function and esthetics.",
    "services.tabFixed": "Fixed",
    "services.tabRemovable": "Removables",
    "services.tabSupport": "Lab Services",

    "svc.crowns.t": "Crowns, Bridges & Veneers",
    "svc.crowns.1": "Zirconia, E-MAX, PFM and full metal cast",
    "svc.crowns.2": "Minimal-prep and no-prep veneers",
    "svc.crowns.3": "PFZ with facial cut-back porcelain",
    "svc.crowns.4": "3D-printed or PMMA temporaries",
    "svc.implants.t": "Implant Restorations",
    "svc.implants.1": "Custom abutments: titanium, zirconia, chrome-cobalt",
    "svc.implants.2": "Screw-retained crowns and bridges",
    "svc.implants.3": "Compatible with all major implant systems",
    "svc.hybrid.t": "Zirconia Hybrid Dentures",
    "svc.hybrid.1": "Full-arch All-on-4, All-on-5 and All-on-6",
    "svc.hybrid.2": "Monolithic zirconia strength with lifelike esthetics",
    "svc.dentures.t": "Dentures",
    "svc.dentures.1": "Full and partial acrylic dentures",
    "svc.dentures.2": "Cast partial frameworks",
    "svc.dentures.3": "Flippers and transitional appliances",
    "svc.dentures.4": "3D-printed full dentures",
    "svc.guards.t": "Bite Guards & Trays",
    "svc.guards.1": "Soft and hard pressed night guards",
    "svc.guards.2": "3D-printed guards",
    "svc.guards.3": "Custom acrylic and 3D-printed trays",
    "svc.design.t": "Design & Milling",
    "svc.design.1": "3Shape digital design services",
    "svc.design.2": "Zirconia and PMMA milling",
    "svc.consult.t": "Case Support",
    "svc.consult.1": "Case planning consultations",
    "svc.consult.2": "Custom shade matching",

    "send.eyebrow": "Getting started is easy",
    "send.title": "Send us a case in three simple steps",
    "send.s1t": "Scan or take an impression",
    "send.s1p": "Send digital files straight from your scanner — 3Shape Trios, iTero, Carestream, 3M True Definition, Sirona Cerec Connect or PlanScan E4D — or prepare a traditional impression.",
    "send.s2t": "Include your RX form",
    "send.s2p": "Fill out our prescription form with your case details and preferences so our technicians have everything they need.",
    "send.s2link": "Download RX form →",
    "send.s3t": "Ship it or send it digitally",
    "send.s3p": "Physical cases can be shipped with any major carrier — or request a shipping label from us and we'll take care of it.",
    "send.s3link": "Request a shipping label →",

    "work.eyebrow": "Our work",
    "work.title": "Results we're proud of",
    "work.sub": "A selection of recent cases from our lab. Photos coming soon.",

    "testi.eyebrow": "What dentists say",
    "testi.title": "Trusted by practices across Maryland",

    "faq.title": "Frequently asked questions",
    "faq.q1": "Where is your work made?",
    "faq.a1": "Everything is produced in our own facility in Cockeysville, Maryland. Scanning, design, milling and porcelain layering all happen in-house, and every final product is made in the USA.",
    "faq.q2": "Which intraoral scanners do you accept files from?",
    "faq.a2": "We accept digital scans from 3Shape Trios, iTero, Carestream, 3M True Definition, Sirona Cerec Connect and PlanScan E4D. If you use a different system, contact us — we can usually find a way to connect.",
    "faq.q3": "What materials do you use?",
    "faq.a3": "We use only FDA-approved materials from trusted manufacturers, including zirconia, E-MAX, PFM alloys, titanium and premium acrylics.",
    "faq.q4": "Can you help me plan a complex case?",
    "faq.a4": "Absolutely. We offer case planning consultations and custom shade matching. Call us and one of our technicians will walk through the case with you.",
    "faq.q5": "How do I get started?",
    "faq.a5": "Just send us your first case — digitally from your scanner or by mail — along with a completed RX form. You can also call us at 410-667-7773 and we'll set everything up for you.",

    "contact.eyebrow": "Contact us",
    "contact.title": "Let's work together",
    "contact.sub": "Questions about a case, materials or turnaround? We'd love to hear from you.",
    "contact.phone": "Phone",
    "contact.fax": "Fax",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.hours": "Hours",
    "contact.hoursVal": "Mon–Fri · (add your hours here)",

    "form.title": "Send us a message",
    "form.name": "Your name",
    "form.namePh": "Dr. Jane Smith",
    "form.practice": "Practice name",
    "form.practicePh": "Smile Dental Care",
    "form.email": "Email",
    "form.message": "Message",
    "form.messagePh": "Tell us about your case or question…",
    "form.send": "Send Message",
    "form.note": "This form opens your email app for now — it can be connected to a mail service later.",

    "fcta.title": "Ready to send your first case?",
    "fcta.sub": "Experience the difference of a lab that treats every restoration like it's going in their own mouth.",
    "fcta.btn": "Send Us a Case",

    "footer.tagline": "Quality dental lab work, made with the best digital solutions — in Cockeysville, Maryland since day one.",
    "footer.company": "Company",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.rights": "© 2026 Elite Dental Lab. All rights reserved.",
    "footer.usa": "All final products proudly made in the USA 🇺🇸"
  },

  es: {
    "util.view": "Vista:",
    "util.desktop": "Escritorio",
    "util.mobile": "Móvil",

    "nav.about": "Nosotros",
    "nav.services": "Servicios",
    "nav.work": "Nuestro Trabajo",
    "nav.send": "Enviar un Caso",
    "nav.faq": "Preguntas",
    "nav.contact": "Contacto",
    "nav.cta": "Iniciar un Caso",

    "hero.eyebrow": "Laboratorio dental digital de servicio completo · Cockeysville, MD",
    "hero.title": "Restauraciones de precisión. Diseñadas digitalmente, terminadas a mano.",
    "hero.sub": "Durante más de 25 años, Elite Dental Lab ha trabajado junto a dentistas para devolver sonrisas sanas y de aspecto natural. Cada caso se escanea, diseña, fresa y estratifica bajo un mismo techo — con orgullo, hecho en EE. UU.",
    "hero.cta1": "Envíenos un Caso",
    "hero.cta2": "Ver Servicios",
    "hero.point1": "Producción interna, de principio a fin",
    "hero.point2": "Solo materiales aprobados por la FDA",
    "hero.point3": "Compatibles con los principales escáneres y sistemas de implantes",
    "hero.badgeTop": "Hecho en EE. UU.",
    "hero.badgeBottom": "Todos los productos finales",

    "ph.heroMedia": "Aquí va su imagen o video principal",
    "ph.photo": "Espacio para foto",
    "ph.case": "Foto de caso",
    "ph.quote": "Aquí irá el texto del testimonio. Reemplácelo con una cita real de uno de sus doctores.",
    "ph.docName": "Nombre del doctor",
    "ph.docPractice": "Nombre de la clínica, Ciudad",
    "ph.map": "Espacio para mapa — inserte Google Maps aquí",

    "stats.years": "Años de experiencia",
    "stats.inhouse": "Producción interna",
    "stats.usaNum": "EE. UU.",
    "stats.usa": "Todos los productos hechos en América",
    "stats.fdaNum": "FDA",
    "stats.fda": "Solo materiales aprobados",

    "about.eyebrow": "Por qué Elite",
    "about.title": "Trabajo restaurador sin compromisos",
    "about.sub": "Construimos un laboratorio donde la tecnología digital moderna y la artesanía tradicional trabajan juntas — para lograr ajustes consistentes, estética natural y un equipo que trata a sus pacientes como propios.",
    "about.c1t": "Todo bajo un mismo techo",
    "about.c1p": "El escaneo, el diseño, el fresado y la estratificación de porcelana se realizan en nuestras propias instalaciones. Sin subcontratación: mayor control de calidad y tiempos confiables.",
    "about.c2t": "Un flujo de trabajo totalmente digital",
    "about.c2p": "Aceptamos archivos de todos los principales escáneres intraorales y diseñamos los casos en 3Shape — para un flujo rápido, preciso y sin repeticiones.",
    "about.c3t": "Solo materiales comprobados",
    "about.c3p": "Trabajamos exclusivamente con materiales aprobados por la FDA de fabricantes de confianza, para que cada restauración sea tan segura y duradera como hermosa.",
    "about.c4t": "Un socio, no solo un laboratorio",
    "about.c4p": "Desde consultas de planificación de casos hasta la toma de color personalizada, nuestros técnicos están disponibles para analizar sus casos y ayudarle a lograr el resultado deseado.",

    "services.eyebrow": "Lo que fabricamos",
    "services.title": "Una gama completa de restauraciones",
    "services.sub": "Desde coronas unitarias hasta casos de implantes de arco completo, todo se elabora con la misma atención al ajuste, la función y la estética.",
    "services.tabFixed": "Fija",
    "services.tabRemovable": "Removible",
    "services.tabSupport": "Servicios de Laboratorio",

    "svc.crowns.t": "Coronas, Puentes y Carillas",
    "svc.crowns.1": "Zirconia, E-MAX, PFM y metal colado completo",
    "svc.crowns.2": "Carillas de preparación mínima y sin preparación",
    "svc.crowns.3": "PFZ con recorte facial de porcelana",
    "svc.crowns.4": "Provisionales impresos en 3D o de PMMA",
    "svc.implants.t": "Restauraciones sobre Implantes",
    "svc.implants.1": "Pilares personalizados: titanio, zirconia, cromo-cobalto",
    "svc.implants.2": "Coronas y puentes atornillados",
    "svc.implants.3": "Compatibles con los principales sistemas de implantes",
    "svc.hybrid.t": "Dentaduras Híbridas de Zirconia",
    "svc.hybrid.1": "Arco completo All-on-4, All-on-5 y All-on-6",
    "svc.hybrid.2": "La resistencia de la zirconia monolítica con estética natural",
    "svc.dentures.t": "Dentaduras",
    "svc.dentures.1": "Dentaduras acrílicas completas y parciales",
    "svc.dentures.2": "Estructuras parciales coladas",
    "svc.dentures.3": "Flippers y aparatos de transición",
    "svc.dentures.4": "Dentaduras completas impresas en 3D",
    "svc.guards.t": "Guardas Oclusales y Cubetas",
    "svc.guards.1": "Guardas nocturnas prensadas blandas y duras",
    "svc.guards.2": "Guardas impresas en 3D",
    "svc.guards.3": "Cubetas personalizadas de acrílico e impresas en 3D",
    "svc.design.t": "Diseño y Fresado",
    "svc.design.1": "Servicios de diseño digital en 3Shape",
    "svc.design.2": "Fresado de zirconia y PMMA",
    "svc.consult.t": "Apoyo de Casos",
    "svc.consult.1": "Consultas de planificación de casos",
    "svc.consult.2": "Toma de color personalizada",

    "send.eyebrow": "Comenzar es fácil",
    "send.title": "Envíenos un caso en tres pasos sencillos",
    "send.s1t": "Escanee o tome una impresión",
    "send.s1p": "Envíe archivos digitales directamente desde su escáner — 3Shape Trios, iTero, Carestream, 3M True Definition, Sirona Cerec Connect o PlanScan E4D — o prepare una impresión tradicional.",
    "send.s2t": "Incluya su receta (RX)",
    "send.s2p": "Complete nuestro formulario de prescripción con los detalles y preferencias del caso para que nuestros técnicos tengan todo lo necesario.",
    "send.s2link": "Descargar formulario RX →",
    "send.s3t": "Envíelo por correo o digitalmente",
    "send.s3p": "Los casos físicos pueden enviarse con cualquier transportista — o solicítenos una etiqueta de envío y nosotros nos encargamos.",
    "send.s3link": "Solicitar etiqueta de envío →",

    "work.eyebrow": "Nuestro trabajo",
    "work.title": "Resultados que nos enorgullecen",
    "work.sub": "Una selección de casos recientes de nuestro laboratorio. Fotos próximamente.",

    "testi.eyebrow": "Lo que dicen los dentistas",
    "testi.title": "La confianza de clínicas en todo Maryland",

    "faq.title": "Preguntas frecuentes",
    "faq.q1": "¿Dónde se fabrica su trabajo?",
    "faq.a1": "Todo se produce en nuestras propias instalaciones en Cockeysville, Maryland. El escaneo, el diseño, el fresado y la estratificación de porcelana se realizan internamente, y cada producto final está hecho en EE. UU.",
    "faq.q2": "¿De qué escáneres intraorales aceptan archivos?",
    "faq.a2": "Aceptamos escaneos digitales de 3Shape Trios, iTero, Carestream, 3M True Definition, Sirona Cerec Connect y PlanScan E4D. Si usa otro sistema, contáctenos — normalmente encontramos la manera de conectarnos.",
    "faq.q3": "¿Qué materiales utilizan?",
    "faq.a3": "Usamos únicamente materiales aprobados por la FDA de fabricantes de confianza, incluidos zirconia, E-MAX, aleaciones PFM, titanio y acrílicos de primera calidad.",
    "faq.q4": "¿Pueden ayudarme a planificar un caso complejo?",
    "faq.a4": "Por supuesto. Ofrecemos consultas de planificación de casos y toma de color personalizada. Llámenos y uno de nuestros técnicos revisará el caso con usted.",
    "faq.q5": "¿Cómo empiezo?",
    "faq.a5": "Simplemente envíenos su primer caso — digitalmente desde su escáner o por correo — junto con un formulario RX completo. También puede llamarnos al 410-667-7773 y lo dejaremos todo listo.",

    "contact.eyebrow": "Contáctenos",
    "contact.title": "Trabajemos juntos",
    "contact.sub": "¿Preguntas sobre un caso, materiales o tiempos de entrega? Nos encantaría saber de usted.",
    "contact.phone": "Teléfono",
    "contact.fax": "Fax",
    "contact.email": "Correo",
    "contact.address": "Dirección",
    "contact.hours": "Horario",
    "contact.hoursVal": "Lun–Vie · (agregue su horario aquí)",

    "form.title": "Envíenos un mensaje",
    "form.name": "Su nombre",
    "form.namePh": "Dra. Juana Pérez",
    "form.practice": "Nombre de la clínica",
    "form.practicePh": "Clínica Dental Sonrisa",
    "form.email": "Correo electrónico",
    "form.message": "Mensaje",
    "form.messagePh": "Cuéntenos sobre su caso o pregunta…",
    "form.send": "Enviar Mensaje",
    "form.note": "Por ahora este formulario abre su aplicación de correo — más adelante puede conectarse a un servicio de correo.",

    "fcta.title": "¿Listo para enviar su primer caso?",
    "fcta.sub": "Experimente la diferencia de un laboratorio que trata cada restauración como si fuera para su propia boca.",
    "fcta.btn": "Envíenos un Caso",

    "footer.tagline": "Trabajo de laboratorio dental de calidad, hecho con las mejores soluciones digitales — en Cockeysville, Maryland desde el primer día.",
    "footer.company": "Empresa",
    "footer.services": "Servicios",
    "footer.contact": "Contacto",
    "footer.rights": "© 2026 Elite Dental Lab. Todos los derechos reservados.",
    "footer.usa": "Todos los productos finales orgullosamente hechos en EE. UU. 🇺🇸"
  }
};

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });
  document.getElementById("btn-en").classList.toggle("active", lang === "en");
  document.getElementById("btn-es").classList.toggle("active", lang === "es");
  localStorage.setItem("edl-lang", lang);
}

/* ---------------- Desktop / Mobile view toggle ---------------- */

const MOBILE_BREAKPOINT = 860;
const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

function applyView() {
  const forced = localStorage.getItem("edl-view"); // "desktop" | "mobile" | null (auto)
  const root = document.documentElement;
  root.classList.remove("m", "forced-mobile", "forced-desktop");

  let effectiveMobile;
  if (forced === "mobile") {
    effectiveMobile = true;
    root.classList.add("m");
    // Show the phone-style frame only when there's room for it
    if (window.innerWidth > 500) root.classList.add("forced-mobile");
  } else if (forced === "desktop") {
    effectiveMobile = false;
    if (mq.matches) root.classList.add("forced-desktop");
  } else {
    effectiveMobile = mq.matches;
    if (effectiveMobile) root.classList.add("m");
  }

  document.getElementById("btn-desktop").classList.toggle("active", !effectiveMobile);
  document.getElementById("btn-mobile").classList.toggle("active", effectiveMobile);
}

/* ---------------- Init ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  // Language
  applyLanguage(localStorage.getItem("edl-lang") || "en");
  document.getElementById("btn-en").addEventListener("click", () => applyLanguage("en"));
  document.getElementById("btn-es").addEventListener("click", () => applyLanguage("es"));

  // View toggle
  applyView();
  mq.addEventListener("change", applyView);
  window.addEventListener("resize", applyView);
  document.getElementById("btn-desktop").addEventListener("click", () => {
    localStorage.setItem("edl-view", "desktop");
    applyView();
  });
  document.getElementById("btn-mobile").addEventListener("click", () => {
    localStorage.setItem("edl-view", "mobile");
    applyView();
  });

  // Service tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
    });
  });

  // Mobile nav menu
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => mainNav.classList.remove("open"))
  );

  // Contact form → opens the user's email app (no backend yet)
  document.getElementById("contact-form").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const subject = encodeURIComponent("Website inquiry from " + f.name.value);
    const body = encodeURIComponent(
      `Name: ${f.name.value}\nPractice: ${f.practice.value}\nEmail: ${f.email.value}\n\n${f.message.value}`
    );
    window.location.href = `mailto:elitedentallabmd@gmail.com?subject=${subject}&body=${body}`;
  });
});
