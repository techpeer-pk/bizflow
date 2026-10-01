/*
 * Biz Flow — single-page app.
 * Hash routing (#/services, #/contact …) so it works on GitHub Pages with no server config.
 */
(function () {
  "use strict";

  const D = window.BIZFLOW;
  const app = document.getElementById("app");
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DEFAULT_TITLE = "Biz Flow — Business Development & Marketing for Educational Institutes";

  /* ---------- Icons (Lucide, ISC licence) ---------- */
  const ICONS = {
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    barChart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.86a10 10 0 0 1 14 0"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    calendarX: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/>',
    trendingUp: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
    sparkles: '<path d="M9.94 15.5a2 2 0 0 0-1.44-1.44l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0l1.58 6.13a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
    graduationCap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'
  };

  const icon = (name, cls = "") =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;

  const tone = (t) =>
    `style="--c:var(--${t});--c-strong:var(--${t}-strong);--c-text:var(--${t}-text);--c-tint:var(--${t}-tint);--c-light:var(--${t}-light)"`;

  const divisionById = (id) => D.divisions.find((d) => d.id === id);

  /* ---------- Shared blocks ---------- */
  function sectionHead(eyebrow, title, sub, center) {
    return `
      <div class="section-head${center ? " center" : ""} reveal">
        <p class="eyebrow">${eyebrow}</p>
        <h2>${title}</h2>
        ${sub ? `<p>${sub}</p>` : ""}
      </div>`;
  }

  function pageHead(eyebrow, title, sub) {
    return `
      <section class="page-head">
        <div class="container">
          <p class="eyebrow">${eyebrow}</p>
          <h1>${title}</h1>
          ${sub ? `<p class="sub">${sub}</p>` : ""}
        </div>
      </section>`;
  }

  function painGrid() {
    return `
      <div class="pain-grid">
        ${D.painPoints
          .map(
            (p) => `
          <article class="pain reveal">
            <div class="ic">${icon(p.icon)}</div>
            <h3>${p.title}</h3>
            <p>${p.text}</p>
          </article>`
          )
          .join("")}
      </div>`;
  }

  function divisionCards() {
    return `
      <div class="div-grid">
        ${D.divisions
          .map(
            (d) => `
          <a class="div-card reveal" href="#/services/${d.id}" ${tone(d.tone)}>
            <div class="top">
              <span class="badge-num">${d.num}</span>
              <h3>${d.name}</h3>
            </div>
            <p class="tag">${d.tagline}</p>
            <ul class="ticks">${d.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
            <span class="more">Learn more ${icon("arrowRight")}</span>
          </a>`
          )
          .join("")}
      </div>`;
  }

  function packageCards(compact) {
    return `
      <div class="pkg-grid${compact ? " compact" : ""}">
        ${D.packages
          .map(
            (p) => `
          <article class="pkg reveal" ${tone(p.tone)}>
            <h3>${p.name}</h3>
            <p class="aud">${p.audience}</p>
            <ul class="ticks">${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
            <a class="btn btn-dark" href="#/contact?package=${p.id}">Request a custom quote</a>
          </article>`
          )
          .join("")}
      </div>`;
  }

  function ctaBand(title, text) {
    return `
      <section class="section section-tight">
        <div class="container">
          <div class="cta-band reveal">
            <div>
              <h2>${title}</h2>
              <p>${text}</p>
            </div>
            <div class="btn-row">
              <a class="btn btn-primary" href="#/contact">Request a quote ${icon("arrowRight")}</a>
              <a class="btn btn-ghost-light" href="tel:${D.contact.phoneTel}">${icon("phone")} Call us</a>
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Views ---------- */
  function homeView() {
    return `
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy reveal">
            <p class="eyebrow eyebrow-light">Business Development &amp; Marketing</p>
            <h1>${D.brand.headline}</h1>
            <p class="lead">${D.brand.intro}</p>
            <div class="btn-row">
              <a class="btn btn-primary" href="#/contact">Request a quote ${icon("arrowRight")}</a>
              <a class="btn btn-ghost-light" href="#/services">Explore services</a>
            </div>
            <p class="hero-tagline">${D.brand.tagline}</p>
          </div>
          <div class="hero-media reveal">
            <img src="assets/img/team.jpg" alt="Illustration of the Biz Flow team" width="1400" height="933">
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${sectionHead(
            "Why institutes need Biz Flow",
            "Five problems that hold institutes back",
            "Rising costs, falling admissions and manual work drain the budget that should go into teaching."
          )}
          ${painGrid()}
        </div>
      </section>

      <section class="section section-alt">
        <div class="container">
          ${sectionHead(
            "Our four integrated divisions",
            "Everything your institute needs to grow",
            "Finance, marketing, technology and events — run by one team that sees the whole picture."
          )}
          ${divisionCards()}
        </div>
      </section>

      <section class="numbers">
        <div class="container">
          <div class="section-head reveal">
            <p class="eyebrow eyebrow-light">By the numbers</p>
            <h2>Results that show up in admissions and accounts</h2>
          </div>
          <div class="num-grid">
            ${D.homeStats
              .map(
                (s) => `
              <div class="num reveal" ${tone(s.tone)}>
                <p class="v">${s.value}</p>
                <p class="l">${s.label}</p>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="head-row">
            ${sectionHead("Packages", "Support that fits your institute", "")}
            <a class="link-arrow reveal" href="#/packages">Compare packages ${icon("arrowRight")}</a>
          </div>
          ${packageCards(true)}
        </div>
      </section>

      ${ctaBand(
        "Let's build the future of your institute <em>together</em>",
        "Tell us about your campus and goals — we'll recommend where to start."
      )}`;
  }

  function servicesView() {
    return `
      ${pageHead(
        "Services",
        "Four integrated divisions, one growth partner",
        "Each division works on its own — and they work best together, because cost savings fund growth and growth needs strong systems."
      )}
      <section class="section">
        <div class="container">
          ${divisionCards()}
        </div>
      </section>
      ${ctaBand("Not sure where to start?", "Most institutes begin with a cost review or an admissions campaign. We'll help you choose.")}`;
  }

  function divisionView(d) {
    const idx = D.divisions.indexOf(d);
    const others = D.divisions.filter((x) => x !== d);

    const services = d.services
      ? `
        <h2 class="h-sm reveal">What we do</h2>
        <div class="svc-list">
          ${d.services
            .map(
              (s) => `
            <div class="svc reveal">
              <div class="ic">${icon("check")}</div>
              <div><h3>${s.title}</h3><p>${s.text}</p></div>
            </div>`
            )
            .join("")}
        </div>
        ${d.result ? `<p class="callout reveal"><strong>Result:</strong> ${d.result}</p>` : ""}`
      : "";

    const stats = d.stats
      ? `
        <div class="stat-grid${d.stats.length === 3 ? " three" : ""}">
          ${d.stats
            .map(
              (s) => `
            <div class="stat reveal">
              <p class="v">${s.value}</p>
              <p class="l">${s.label}</p>
            </div>`
            )
            .join("")}
        </div>`
      : "";

    const caseStudy = d.caseStudy
      ? `
        <div class="dark-box reveal">
          <p class="label">${d.caseStudy.label}</p>
          <h3>${d.caseStudy.title}</h3>
          <ul>${d.caseStudy.points.map((p) => `<li>${icon("checkCircle")}${p}</li>`).join("")}</ul>
          <p class="outcome">${d.caseStudy.outcome}</p>
        </div>`
      : "";

    const engine = d.engine
      ? `
        <div class="dark-box reveal">
          <p class="label">${d.engine.label}</p>
          <ul>${d.engine.items.map((p) => `<li>${icon("checkCircle")}${p}</li>`).join("")}</ul>
          <p class="foot">${d.engine.footnote}</p>
        </div>`
      : "";

    const process = d.process
      ? `
        <h2 class="h-sm reveal">How we run every event</h2>
        <ol class="steps">
          ${d.process
            .map(
              (s, i) => `
            <li class="step reveal">
              <span class="n">${i + 1}</span>
              <h3>${s.title}</h3>
              <p>${s.text}</p>
            </li>`
            )
            .join("")}
        </ol>`
      : "";

    const body = d.process
      ? `${process}<div class="spacer"></div>${stats}`
      : `
        <div class="split">
          <div>${services}</div>
          <aside class="aside-stack">${stats}${caseStudy}${engine}</aside>
        </div>`;

    const prev = D.divisions[(idx + D.divisions.length - 1) % D.divisions.length];
    const next = D.divisions[(idx + 1) % D.divisions.length];

    return `
      <section class="page-head division-head" ${tone(d.tone)}>
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/services">Services</a> <span aria-hidden="true">/</span> Division ${d.num}</nav>
          <div class="title-row">
            <span class="badge-num lg">${d.num}</span>
            <h1>${d.name}</h1>
          </div>
          <p class="sub">${d.tagline}</p>
          <div class="btn-row">
            <a class="btn btn-dark" href="#/contact?service=${d.id}">Discuss this service ${icon("arrowRight")}</a>
          </div>
        </div>
      </section>

      <section class="section" ${tone(d.tone)}>
        <div class="container">${body}</div>
      </section>

      <section class="section section-alt">
        <div class="container">
          ${sectionHead("Explore", "Our other divisions", "")}
          <div class="mini-grid">
            ${others
              .map(
                (o) => `
              <a class="mini reveal" href="#/services/${o.id}" ${tone(o.tone)}>
                <span class="badge-num">${o.num}</span>
                <span><strong>${o.name}</strong><small>${o.tagline}</small></span>
              </a>`
              )
              .join("")}
          </div>
          <div class="pager">
            <a href="#/services/${prev.id}">${icon("arrowLeft")} ${prev.name}</a>
            <a href="#/services/${next.id}">${next.name} ${icon("arrowRight")}</a>
          </div>
        </div>
      </section>

      ${ctaBand(`Interested in ${d.name}?`, "Share a few details and we'll come back with a plan for your institute.")}`;
  }

  function packagesView() {
    const cell = (v) =>
      v === true
        ? `<td class="yes">${icon("check")}<span class="sr-only">Included</span></td>`
        : v === false
          ? `<td class="no"><span aria-hidden="true">—</span><span class="sr-only">Not included</span></td>`
          : `<td>${v}</td>`;

    return `
      ${pageHead(
        "Packages",
        "Packages tailored for educational institutes",
        "Choose the level of support that fits your institute. Every package is quoted to your campus size and goals."
      )}
      <section class="section">
        <div class="container">
          ${packageCards(false)}
        </div>
      </section>

      <section class="section section-alt">
        <div class="container">
          ${sectionHead("Compare", "What each package covers", "")}
          <div class="compare-wrap reveal">
            <table class="compare">
              <thead>
                <tr><th scope="col">Division</th>${D.packages.map((p) => `<th scope="col">${p.name}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${D.coverage
                  .map(
                    (r) =>
                      `<tr><th scope="row">${r.label}</th>${cell(r.starter)}${cell(r.growth)}${cell(r.enterprise)}</tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      ${ctaBand("Not sure which package fits?", "Tell us about your institute and we'll recommend one — or build a custom mix.")}`;
  }

  function aboutView() {
    return `
      ${pageHead("About us", "Who we are", "A next-gen growth partner for schools, colleges & universities.")}
      <section class="section">
        <div class="container split about-split">
          <div>
            <p class="lead-dark reveal">${D.brand.intro}</p>
            <div class="dark-box mission reveal">
              <p class="label">Our mission</p>
              <p class="mission-text">${D.mission}</p>
            </div>
            <h2 class="h-sm reveal">Core values</h2>
            <div class="values">
              ${D.values
                .map(
                  (v) => `
                <div class="value reveal" ${tone(v.tone)}>
                  <span class="ic">${icon(v.icon)}</span>${v.title}
                </div>`
                )
                .join("")}
            </div>
          </div>
          <div class="photo-card reveal">
            <img src="assets/img/team.jpg" alt="Illustration of the Biz Flow team" width="1400" height="933" loading="lazy">
            <p class="photo-caption">${icon("mapPin")} Head office: ${D.contact.office}</p>
          </div>
        </div>
      </section>

      <section class="section section-alt">
        <div class="container">
          ${sectionHead("Why institutes need Biz Flow", "The problems we solve", "")}
          ${painGrid()}
        </div>
      </section>

      ${ctaBand(
        "Let's build the future of your institute <em>together</em>",
        "Thank you for your interest — we look forward to growing together."
      )}`;
  }

  function contactView() {
    const c = D.contact;
    return `
      ${pageHead(
        "Contact",
        "Let's build the future of your institute together",
        "Share a few details about your institute. We'll reply with a recommended starting point and a custom quote."
      )}
      <section class="section">
        <div class="container contact-grid">
          <form id="contact-form" class="form reveal" novalidate>
            <div class="form-grid">
              <div class="field">
                <label for="f-name">Your name <span class="req" aria-hidden="true">*</span></label>
                <input id="f-name" name="name" autocomplete="name" required aria-describedby="e-name">
                <p class="err" id="e-name"></p>
              </div>
              <div class="field">
                <label for="f-institute">Institute name <span class="req" aria-hidden="true">*</span></label>
                <input id="f-institute" name="institute" autocomplete="organization" required aria-describedby="e-institute">
                <p class="err" id="e-institute"></p>
              </div>
              <div class="field">
                <label for="f-type">Institute type</label>
                <select id="f-type" name="type">
                  <option value="">Select…</option>
                  <option>School</option>
                  <option>College</option>
                  <option>University</option>
                  <option>School / college chain</option>
                </select>
              </div>
              <div class="field">
                <label for="f-campuses">Number of campuses</label>
                <input id="f-campuses" name="campuses" type="number" min="1" inputmode="numeric">
              </div>
              <div class="field">
                <label for="f-phone">Phone / WhatsApp</label>
                <input id="f-phone" name="phone" type="tel" autocomplete="tel" placeholder="03XX XXXXXXX" aria-describedby="e-phone">
                <p class="err" id="e-phone"></p>
              </div>
              <div class="field">
                <label for="f-email">Email</label>
                <input id="f-email" name="email" type="email" autocomplete="email" aria-describedby="e-email">
                <p class="err" id="e-email"></p>
              </div>
              <fieldset class="field full">
                <legend class="legend">Interested in</legend>
                <div class="chips">
                  ${D.divisions
                    .map(
                      (d) => `
                    <label class="chip" ${tone(d.tone)}>
                      <input type="checkbox" name="services" value="${d.id}">
                      <span>${d.name}</span>
                    </label>`
                    )
                    .join("")}
                </div>
              </fieldset>
              <div class="field">
                <label for="f-package">Package</label>
                <select id="f-package" name="package">
                  <option value="">Not sure yet</option>
                  ${D.packages.map((p) => `<option value="${p.id}">${p.name} — ${p.audience}</option>`).join("")}
                </select>
              </div>
              <div class="field">
                <label for="f-city">City</label>
                <input id="f-city" name="city" autocomplete="address-level2">
              </div>
              <div class="field full">
                <label for="f-message">Message</label>
                <textarea id="f-message" name="message" rows="5" placeholder="What would you like to improve — costs, admissions, IT, events?"></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn btn-dark" type="submit" value="email">${icon("mail")} Send via email</button>
              <button class="btn btn-whatsapp" type="submit" value="whatsapp">${icon("message")} Send via WhatsApp</button>
            </div>
            <p class="form-note">Your message opens in your email app or WhatsApp, ready to send. Nothing is stored on this website.</p>
            <p class="status" id="form-status" role="status" aria-live="polite"></p>
          </form>

          <aside class="contact-cards">
            <a class="c-card reveal" href="tel:${c.phoneTel}">
              <span class="ic">${icon("phone")}</span>
              <span><span class="k">Phone</span><span class="val">${c.phoneDisplay}</span></span>
            </a>
            <a class="c-card reveal" href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">
              <span class="ic">${icon("message")}</span>
              <span><span class="k">WhatsApp</span><span class="val">Chat with us</span></span>
            </a>
            <a class="c-card reveal" href="mailto:${c.email}">
              <span class="ic">${icon("mail")}</span>
              <span><span class="k">Email</span><span class="val">${c.email}</span></span>
            </a>
            <div class="c-card reveal">
              <span class="ic">${icon("mapPin")}</span>
              <span><span class="k">Head office</span><span class="val">${c.office}</span></span>
            </div>
            <a class="c-card reveal" href="https://${c.website}" target="_blank" rel="noopener">
              <span class="ic">${icon("globe")}</span>
              <span><span class="k">Web</span><span class="val">${c.website}</span></span>
            </a>
          </aside>
        </div>
      </section>`;
  }

  function notFoundView() {
    return `
      <section class="section">
        <div class="container narrow center">
          <p class="eyebrow">404</p>
          <h1>Page not found</h1>
          <p class="muted">The page you're looking for doesn't exist or has moved.</p>
          <a class="btn btn-dark" href="#/">${icon("arrowLeft")} Back to home</a>
        </div>
      </section>`;
  }

  /* ---------- Contact form ---------- */
  function bindContactForm(query) {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const pkg = query.get("package");
    if (pkg && D.packages.some((p) => p.id === pkg)) form.elements.package.value = pkg;
    const svc = query.get("service");
    if (svc && divisionById(svc)) {
      const box = form.querySelector(`input[name="services"][value="${svc}"]`);
      if (box) box.checked = true;
    }

    const setError = (name, msg) => {
      const input = form.elements[name];
      const err = document.getElementById("e-" + name);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg || "";
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const via = (e.submitter && e.submitter.value) || "email";
      const v = (n) => (form.elements[n].value || "").trim();
      const errors = [];

      ["name", "institute", "phone", "email"].forEach((n) => setError(n, ""));
      if (!v("name")) errors.push(["name", "Please enter your name."]);
      if (!v("institute")) errors.push(["institute", "Please enter your institute's name."]);
      if (!v("phone") && !v("email")) errors.push(["phone", "Add a phone number or an email so we can reply."]);
      if (v("email") && !form.elements.email.checkValidity()) errors.push(["email", "Please enter a valid email address."]);

      if (errors.length) {
        errors.forEach(([n, m]) => setError(n, m));
        form.elements[errors[0][0]].focus();
        return;
      }

      const services = [...form.querySelectorAll('input[name="services"]:checked')]
        .map((b) => divisionById(b.value).name)
        .join(", ");
      const pkgName = (D.packages.find((p) => p.id === v("package")) || {}).name;
      const lines = [
        "Hello Biz Flow,",
        "",
        `Name: ${v("name")}`,
        `Institute: ${v("institute")}`,
        v("type") && `Type: ${v("type")}`,
        v("campuses") && `Campuses: ${v("campuses")}`,
        v("city") && `City: ${v("city")}`,
        v("phone") && `Phone: ${v("phone")}`,
        v("email") && `Email: ${v("email")}`,
        services && `Interested in: ${services}`,
        `Package: ${pkgName || "Not sure yet"}`,
        v("message") && ["", v("message")].join("\n")
      ].filter(Boolean);
      const text = lines.join("\n");
      const status = document.getElementById("form-status");

      if (via === "whatsapp") {
        window.open(`https://wa.me/${D.contact.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
        status.textContent = "WhatsApp should open in a new tab with your message ready — just press send.";
      } else {
        const subject = `Quote request — ${v("institute")}`;
        window.location.href = `mailto:${D.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
        status.textContent = `Your email app should open with the message ready. If it doesn't, write to us at ${D.contact.email}.`;
      }
      status.classList.add("show");
    });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const c = D.contact;
    document.getElementById("site-footer").innerHTML = `
      <div class="container footer-grid">
        <div class="footer-brand">
          <a href="#/" class="brand brand-light"><img src="assets/img/mark.png" alt="" width="98" height="48"><span>Biz Flow</span></a>
          <p>Business development &amp; marketing for schools, colleges and universities.</p>
          <p class="footer-tagline">${D.brand.tagline}</p>
        </div>
        <div>
          <h2 class="f-h">Services</h2>
          <ul>${D.divisions.map((d) => `<li><a href="#/services/${d.id}">${d.name}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h2 class="f-h">Company</h2>
          <ul>
            <li><a href="#/about">About us</a></li>
            <li><a href="#/packages">Packages</a></li>
            <li><a href="#/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h2 class="f-h">Get in touch</h2>
          <ul class="contact-list">
            <li>${icon("mapPin")}<span>Head office: ${c.office}</span></li>
            <li>${icon("phone")}<a href="tel:${c.phoneTel}">${c.phoneDisplay}</a></li>
            <li>${icon("mail")}<a href="mailto:${c.email}">${c.email}</a></li>
            <li>${icon("globe")}<a href="https://${c.website}" target="_blank" rel="noopener">${c.website}</a></li>
          </ul>
        </div>
      </div>
      <div class="container">
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} Biz Flow. All rights reserved.</p>
          <p>Cost Controls · Marketing &amp; AI Content · IT Support · Event Management</p>
        </div>
      </div>`;
  }

  /* ---------- Router ---------- */
  const routes = [
    { re: /^\/$/, nav: "home", view: () => ({ html: homeView() }) },
    { re: /^\/services$/, nav: "services", view: () => ({ html: servicesView(), title: "Services" }) },
    {
      re: /^\/services\/([\w-]+)$/,
      nav: "services",
      view: (m) => {
        const d = divisionById(m[1]);
        return d && { html: divisionView(d), title: d.name };
      }
    },
    { re: /^\/packages$/, nav: "packages", view: () => ({ html: packagesView(), title: "Packages" }) },
    { re: /^\/about$/, nav: "about", view: () => ({ html: aboutView(), title: "About us" }) },
    {
      re: /^\/contact$/,
      nav: "contact",
      view: () => ({ html: contactView(), title: "Contact", after: bindContactForm })
    }
  ];

  function resolve(path) {
    for (const r of routes) {
      const m = path.match(r.re);
      if (!m) continue;
      const out = r.view(m);
      if (out) return Object.assign({ nav: r.nav }, out);
    }
    return { html: notFoundView(), title: "Page not found", nav: null };
  }

  function render(isInitial) {
    const raw = window.location.hash.replace(/^#/, "");
    // Ignore plain in-page anchors (e.g. #app); only "#/…" hashes are routes.
    if (raw && !raw.startsWith("/")) {
      if (!isInitial) return;
    }
    const [rawPath, qs] = (raw.startsWith("/") ? raw : "/").split("?");
    const path = rawPath.replace(/\/+$/, "") || "/";
    const query = new URLSearchParams(qs || "");
    const out = resolve(path);

    app.innerHTML = out.html;
    document.title = out.title ? `${out.title} · Biz Flow` : DEFAULT_TITLE;

    nav.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === out.nav) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    closeMenu();
    if (out.after) out.after(query);
    initReveal();

    if (!isInitial) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      app.focus({ preventScroll: true });
    }
  }

  /* ---------- Scroll reveal ---------- */
  let observer = null;
  function initReveal() {
    const els = app.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            observer.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    els.forEach((el) => observer.observe(el));
  }

  /* ---------- Mobile menu & header ---------- */
  function closeMenu() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  navToggle.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelector(".skip-link").addEventListener("click", (e) => {
    e.preventDefault();
    app.focus();
  });

  /* ---------- PWA: offline support + install button ---------- */
  const installBtn = document.getElementById("install-btn");
  let installPrompt = null;

  // Chrome, Edge and Android fire this when the site can be installed.
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e;
    installBtn.hidden = false;
  });

  installBtn.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installBtn.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installBtn.hidden = true;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  if (!reduceMotion) document.documentElement.classList.add("js-reveal");
  renderFooter();
  window.addEventListener("hashchange", () => render(false));
  render(true);
  onScroll();
})();
