const DOMAIN_SUFFIX = ".en";
const STORAGE_KEY = "example-en-domains";
const LANGUAGE_KEY = "example-language";
const THEME_KEY = "example-theme";
const RESERVED = new Set(["example", "test", "admin", "www", "opencodex"]);

const translations = {
  en: { home:"Home", domains:"Domains", about:"About", createDomain:"Create Domain", kicker:"EXPERIMENTAL DOMAIN PLATFORM", heroTitle:"Your domain.<br><em>Your identity.</em>", heroText:"Create and manage your own .en domain names in one simple place.", learnMore:"Learn more", searchLabel:"Search your .en domain", searchPlaceholder:"Search your .en domain", searchHint:"Find out if your idea is available.", search:"Search", builtFor:"BUILT FOR EXPERIMENTATION", localFirst:"Local-first · Private · Static", createKicker:"GET STARTED", createTitle:"Create your .en domain", createDescription:"Give your next idea a home.", enterName:"Enter domain name", namePlaceholder:"mywebsite", create:"Create", dashboardKicker:"YOUR WORKSPACE", dashboardTitle:"Domain dashboard", domainColumn:"Domain", statusColumn:"Status", createdColumn:"Created", actionsColumn:"Actions", emptyDomains:"Your created domains will appear here.", aboutKicker:"ABOUT THE PROJECT", aboutTitle:"About Example.en", aboutText:"Example.en is a demonstration platform for managing experimental .en domain names.", aboutNotice:"This is a local demo. It does not register a real TLD or publish DNS records on the global internet.", footerNote:"An experimental domain system — not a real public TLD.", available:"Available", registered:"Registered", reserved:"Reserved", register:"Register", copy:"Copy", view:"View", delete:"Delete", copied:"Domain copied", created:"Domain created successfully", deleted:"Domain deleted", invalid:"Use 1–63 lowercase letters, numbers, or hyphens. Names cannot start or end with a hyphen.", reservedError:"This name is reserved and cannot be registered.", exists:"This domain already exists.", empty:"Enter a domain name first." },
  ar: { home:"الرئيسية", domains:"النطاقات", about:"حول", createDomain:"إنشاء نطاق", kicker:"منصة نطاقات تجريبية", heroTitle:"نطاقك.<br><em>هويتك.</em>", heroText:"أنشئ وأدر أسماء نطاقات .en الخاصة بك في مكان واحد وببساطة.", learnMore:"اعرف المزيد", searchLabel:"ابحث عن نطاق .en", searchPlaceholder:"ابحث عن نطاق .en", searchHint:"تحقق من توفر فكرتك.", search:"بحث", builtFor:"مصمم للتجارب", localFirst:"محلي · خاص · ثابت", createKicker:"ابدأ الآن", createTitle:"أنشئ نطاق .en الخاص بك", createDescription:"امنح فكرتك القادمة مكانًا.", enterName:"أدخل اسم النطاق", namePlaceholder:"mywebsite", create:"إنشاء", dashboardKicker:"مساحة العمل", dashboardTitle:"لوحة النطاقات", domainColumn:"النطاق", statusColumn:"الحالة", createdColumn:"تاريخ الإنشاء", actionsColumn:"الإجراءات", emptyDomains:"ستظهر النطاقات التي تنشئها هنا.", aboutKicker:"عن المشروع", aboutTitle:"حول Example.en", aboutText:"Example.en منصة توضيحية لإدارة أسماء نطاقات .en التجريبية.", aboutNotice:"هذا نظام تجريبي محلي. لا يسجل TLD حقيقيًا ولا ينشر سجلات DNS على الإنترنت العالمي.", footerNote:"نظام نطاقات تجريبي — ليس TLD عامًا حقيقيًا.", available:"متاح", registered:"مسجل", reserved:"محجوز", register:"تسجيل", copy:"نسخ", view:"عرض", delete:"حذف", copied:"تم نسخ النطاق", created:"تم إنشاء النطاق بنجاح", deleted:"تم حذف النطاق", invalid:"استخدم 1–63 حرفًا إنجليزيًا صغيرًا أو رقمًا أو شرطة. لا يبدأ الاسم أو ينتهي بشرطة.", reservedError:"هذا الاسم محجوز ولا يمكن تسجيله.", exists:"هذا النطاق موجود بالفعل.", empty:"أدخل اسم النطاق أولًا." }
};

function readStorage(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch { /* The app remains usable without persistence. */ }
}
let language = readStorage(LANGUAGE_KEY, "en");
if (!Object.prototype.hasOwnProperty.call(translations, language)) language = "en";
let domains = readDomains();
const $ = selector => document.querySelector(selector);
const t = key => translations[language][key] || key;

function readDomains() {
  try {
    const value = JSON.parse(readStorage(STORAGE_KEY, "[]"));
    if (!Array.isArray(value)) return [];
    return value.filter(item => item && typeof item.name === "string" && isValidName(item.name))
      .map(item => ({ name: item.name.toLowerCase(), status: "Registered", createdAt: validDate(item.createdAt) }));
  } catch { return []; }
}
function validDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(); }
function saveDomains() { writeStorage(STORAGE_KEY, JSON.stringify(domains)); }
function cleanName(value) { return value.trim().toLowerCase().replace(/\.en$/i, ""); }
function isValidName(name) { return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(name); }
function fullDomain(name) { return `${name}${DOMAIN_SUFFIX}`; }
function formatDate(value) { try { return new Intl.DateTimeFormat(language, { year: "numeric", month: "short", day: "numeric" }).format(new Date(value)); } catch { return "—"; } }
function notify(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove("show"), 2600); }

function domainNode(name) {
  const strong = document.createElement("strong"); strong.className = "domain-cell";
  const namePart = document.createElement("span"); namePart.textContent = name;
  strong.append(namePart, DOMAIN_SUFFIX); return strong;
}
function renderDomains() {
  const table = $("#domainTable"); table.replaceChildren();
  const suffix = language === "ar" ? "نطاق" : domains.length === 1 ? "domain" : "domains";
  $("#domainCount").textContent = `${domains.length} ${suffix}`;
  if (!domains.length) { const row = document.createElement("tr"); row.className = "empty-row"; const cell = document.createElement("td"); cell.colSpan = 4; cell.textContent = t("emptyDomains"); row.append(cell); table.append(row); return; }
  domains.forEach((domain, index) => {
    const row = document.createElement("tr"); const nameCell = document.createElement("td"); nameCell.append(domainNode(domain.name));
    const statusCell = document.createElement("td"); const status = document.createElement("span"); status.className = "status"; status.textContent = t("registered"); statusCell.append(status);
    const dateCell = document.createElement("td"); dateCell.textContent = formatDate(domain.createdAt);
    const actionCell = document.createElement("td"); const actions = document.createElement("div"); actions.className = "row-actions";
    [["copy", "copy"], ["view", "view"], ["delete", "delete"]].forEach(([action, label]) => { const button = document.createElement("button"); button.className = "table-button"; button.type = "button"; button.dataset.action = action; button.dataset.index = String(index); button.textContent = t(label); actions.append(button); });
    actionCell.append(actions); row.append(nameCell, statusCell, dateCell, actionCell); table.append(row);
  });
}
function applyLanguage() {
  document.documentElement.lang = language; document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; $("#languageToggle").textContent = language === "en" ? "AR" : "EN";
  document.querySelectorAll("[data-i18n]").forEach(element => { element.innerHTML = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  renderDomains(); showSearchResult();
}
function showSearchResult() {
  const result = $("#searchResult"); result.replaceChildren(); const name = cleanName($("#searchInput").value);
  if (!name) { const hint = document.createElement("span"); hint.className = "result-hint"; hint.textContent = t("searchHint"); result.append(hint); return; }
  if (!isValidName(name)) { const error = document.createElement("span"); error.className = "form-error"; error.textContent = t("invalid"); result.append(error); return; }
  const domain = document.createElement("span"); domain.className = "result-domain"; domain.textContent = fullDomain(name);
  const status = document.createElement("span"); const reserved = RESERVED.has(name); const existing = domains.some(item => item.name === name); status.className = `result-status ${reserved || existing ? "registered" : ""}`; status.textContent = reserved ? t("reserved") : existing ? t("registered") : t("available"); result.append(domain, status);
  if (!reserved && !existing) { const button = document.createElement("button"); button.className = "result-register"; button.type = "button"; button.textContent = t("register"); button.addEventListener("click", () => createDomain(name)); result.append(button); }
}
function createDomain(rawName) {
  const name = cleanName(rawName); $("#formError").textContent = "";
  if (!name) { $("#formError").textContent = t("empty"); notify(t("empty")); return; }
  if (!isValidName(name)) { $("#formError").textContent = t("invalid"); notify(t("invalid")); return; }
  if (RESERVED.has(name)) { $("#formError").textContent = t("reservedError"); notify(t("reservedError")); return; }
  if (domains.some(item => item.name === name)) { $("#formError").textContent = t("exists"); notify(t("exists")); return; }
  domains.unshift({ name, status: "Registered", createdAt: new Date().toISOString() }); saveDomains(); renderDomains(); $("#createInput").value = ""; notify(t("created")); location.hash = "domains";
}

$("#createForm").addEventListener("submit", event => { event.preventDefault(); createDomain($("#createInput").value); });
$("#searchButton").addEventListener("click", showSearchResult); $("#searchInput").addEventListener("keydown", event => { if (event.key === "Enter") showSearchResult(); }); $("#searchInput").addEventListener("input", showSearchResult);
$("#domainTable").addEventListener("click", async event => { const button = event.target.closest("button[data-action]"); if (!button) return; const index = Number(button.dataset.index); const domain = domains[index]; if (!domain) return; const value = fullDomain(domain.name); if (button.dataset.action === "delete") { domains.splice(index, 1); saveDomains(); renderDomains(); notify(t("deleted")); } else if (button.dataset.action === "view") { $("#searchInput").value = domain.name; showSearchResult(); location.hash = "home"; } else { try { await navigator.clipboard.writeText(value); } catch { const area = document.createElement("textarea"); area.value = value; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); } notify(t("copied")); } });
$("#themeToggle").addEventListener("click", () => { const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = next; writeStorage(THEME_KEY, next); $("#themeToggle").textContent = next === "dark" ? "☀" : "☾"; });
$("#languageToggle").addEventListener("click", () => { language = language === "en" ? "ar" : "en"; writeStorage(LANGUAGE_KEY, language); applyLanguage(); });
$("#year").textContent = new Date().getFullYear(); applyLanguage(); $("#themeToggle").textContent = document.documentElement.dataset.theme === "dark" ? "☀" : "☾";
