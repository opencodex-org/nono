const STORAGE_KEY = "example-domains";
const translations = {
  ar: {
    navHome: "الرئيسية", navCreate: "إنشاء نطاق", navDomains: "نطاقاتي", eyebrow: "مساحة آمنة للتجارب", heroTitle: "نطاقك التجريبي،<br><span>ببساطة.</span>", heroText: "أنشئ نطاقات تجريبية لمشاريعك وأفكارك خلال ثوانٍ. لا خوادم، لا تعقيد، وكل شيء محفوظ على جهازك.", startNow: "ابدأ الآن", experimentalDomain: "نطاق تجريبي", featureOneTitle: "سريع وبسيط", featureOneText: "أنشئ نطاقك في خطوة واحدة دون إعدادات معقدة.", featureTwoTitle: "محلي وآمن", featureTwoText: "بياناتك تبقى في متصفحك باستخدام LocalStorage.", featureThreeTitle: "جاهز للمشاركة", featureThreeText: "انسخ أي نطاق بسهولة واستخدمه في نماذجك الأولية.", workspaceEyebrow: "مساحة العمل", workspaceTitle: "أنشئ نطاقًا تجريبيًا", nameLabel: "اسم النطاق", namePlaceholder: "my-project", nameHint: "استخدم الأحرف الإنجليزية الصغيرة والأرقام والشرطة فقط.", createButton: "إنشاء النطاق", livePreview: "معاينة مباشرة", previewText: "سيظهر نطاقك هنا قبل الحفظ.", domainsEyebrow: "مجموعتك", domainsTitle: "النطاقات التجريبية", emptyState: "لم تنشئ أي نطاق بعد. ابدأ بتجربة اسم جديد.", footerText: "مشروع تجريبي ثابت — لا يتم إنشاء نطاقات حقيقية.", available: "Available", registered: "Registered", copy: "نسخ", copied: "تم نسخ النطاق", delete: "حذف", invalid: "أدخل اسمًا صحيحًا: أحرف إنجليزية صغيرة، أرقام أو شرطة.", duplicate: "هذا النطاق موجود بالفعل.", created: "تم إنشاء النطاق بنجاح.", emptyName: "أدخل اسم النطاق أولًا."
  },
  en: {
    navHome: "Home", navCreate: "Create domain", navDomains: "My domains", eyebrow: "A safe space to experiment", heroTitle: "Your test domain,<br><span>made simple.</span>", heroText: "Create test domains for your projects and ideas in seconds. No servers, no complexity, and everything stays on your device.", startNow: "Start now", experimentalDomain: "Experimental domain", featureOneTitle: "Fast and simple", featureOneText: "Create your domain in one step with no complex setup.", featureTwoTitle: "Local and private", featureTwoText: "Your data stays in your browser using LocalStorage.", featureThreeTitle: "Ready to share", featureThreeText: "Copy any domain easily and use it in your prototypes.", workspaceEyebrow: "Workspace", workspaceTitle: "Create a test domain", nameLabel: "Domain name", namePlaceholder: "my-project", nameHint: "Use lowercase English letters, numbers, and hyphens only.", createButton: "Create domain", livePreview: "Live preview", previewText: "Your domain will appear here before saving.", domainsEyebrow: "Your collection", domainsTitle: "Test domains", emptyState: "You have not created a domain yet. Try a new name.", footerText: "Static demo project — no real domains are created.", available: "Available", registered: "Registered", copy: "Copy", copied: "Domain copied", delete: "Delete", invalid: "Enter a valid name: lowercase English letters, numbers, or hyphens.", duplicate: "This domain already exists.", created: "Domain created successfully.", emptyName: "Enter a domain name first."
  }
};
let language = "ar";
let domains = loadDomains();
const form = document.querySelector("#domainForm");
const input = document.querySelector("#domainName");
const preview = document.querySelector("#previewDomain");
const list = document.querySelector("#domainList");
const count = document.querySelector("#domainCount");
const toast = document.querySelector("#toast");

function loadDomains() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveDomains() { localStorage.setItem(STORAGE_KEY, JSON.stringify(domains)); }
function t(key) { return translations[language][key] || key; }
function escapeHtml(value) { return value.replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char])); }
function validName(value) { return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value); }
function showToast(message) { toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400); }
function updatePreview() { const value = input.value.trim().toLowerCase() || "my-project"; preview.innerHTML = `${escapeHtml(value)}<span>.example.en</span>`; }
function renderDomains() {
  count.textContent = domains.length;
  if (!domains.length) { list.innerHTML = `<div class="empty-state" id="emptyState"><span>◌</span><p>${t("emptyState")}</p></div>`; return; }
  list.innerHTML = domains.map((domain, index) => `<article class="domain-item"><div class="domain-item-name">${escapeHtml(domain.name)}<span>.example.en</span></div><div class="domain-actions"><span class="status ${domain.status === "Registered" ? "registered" : ""}">${domain.status === "Registered" ? t("registered") : t("available")}</span><button class="copy-button" data-action="copy" data-index="${index}" type="button">${t("copy")}</button><button class="delete-button" data-action="delete" data-index="${index}" type="button" aria-label="${t("delete")}">×</button></div></article>`).join("");
}
function applyLanguage() {
  document.documentElement.lang = language; document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.querySelector("#languageToggle").textContent = language === "ar" ? "EN" : "عربي";
  document.querySelectorAll("[data-i18n]").forEach(element => element.innerHTML = t(element.dataset.i18n));
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => element.placeholder = t(element.dataset.i18nPlaceholder));
  renderDomains();
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const value = input.value.trim().toLowerCase();
  const message = document.querySelector("#formMessage");
  if (!value) { message.textContent = t("emptyName"); return; }
  if (!validName(value)) { message.textContent = t("invalid"); return; }
  if (domains.some(domain => domain.name === value)) { message.textContent = t("duplicate"); return; }
  domains.unshift({ name: value, status: "Available" }); saveDomains(); renderDomains(); input.value = ""; updatePreview(); message.textContent = ""; showToast(t("created"));
});
input.addEventListener("input", () => { input.value = input.value.toLowerCase(); document.querySelector("#formMessage").textContent = ""; updatePreview(); });
document.querySelector("#languageToggle").addEventListener("click", () => { language = language === "ar" ? "en" : "ar"; applyLanguage(); });
list.addEventListener("click", async event => {
  const button = event.target.closest("button"); if (!button) return;
  const index = Number(button.dataset.index); const domain = domains[index];
  if (button.dataset.action === "delete") { domains.splice(index, 1); saveDomains(); renderDomains(); return; }
  if (button.dataset.action === "copy") {
    const fullDomain = `${domain.name}.example.en`;
    try { await navigator.clipboard.writeText(fullDomain); } catch { const temporary = document.createElement("textarea"); temporary.value = fullDomain; document.body.appendChild(temporary); temporary.select(); document.execCommand("copy"); temporary.remove(); }
    showToast(t("copied"));
  }
});
updatePreview(); renderDomains();
