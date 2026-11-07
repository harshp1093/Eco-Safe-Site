// ---------- Runs immediately in <head> ----------

// 1. Apply the saved (or device) theme before the page paints
(function () {
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
})();

// 2. If a photo hasn't been uploaded yet, show a branded placeholder instead of a broken image
window.addEventListener("error", function (e) {
  var el = e.target;
  if (el && el.tagName === "IMG") {
    var slot = el.closest(".media");
    if (slot) slot.classList.add("missing");
  }
}, true);

// ---------- Runs once the page has loaded ----------
document.addEventListener("DOMContentLoaded", function () {
  var root = document.documentElement;

  // Dark / light toggle
  document.getElementById("theme-toggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Follow the device setting until the visitor picks a theme
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (!saved) root.setAttribute("data-theme", e.matches ? "dark" : "light");
  });

  // Mobile menu
  var menuBtn = document.getElementById("menu-toggle");
  var links = document.getElementById("nav-links");
  menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Fade sections in as they scroll into view
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }
});
