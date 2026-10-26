(function () {
  "use strict";
 
  function initMap() {
    let mapEl = document.getElementById("contactMap");
    if (!mapEl || typeof window.L === "undefined") return; // Leaflet not available — keep static fallback
 
    // Bright Futures Community Trust — 128 Maple Street, Riverside, CA 92501
    let lat = 33.9806;
    let lng = -117.3755;
 
    let map = window.L.map(mapEl, {
      scrollWheelZoom: false
    }).setView([lat, lng], 15);
 
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
 
    let marker = window.L.marker([lat, lng]).addTo(map);
    marker.bindPopup(
      "<strong>Bright Futures Community Trust</strong><br>128 Maple Street, Riverside, CA 92501"
    );
    // Re-enable scroll zoom only once the visitor clicks into the map,
    // so the page itself still scrolls normally by default.
    map.on("click", function () { map.scrollWheelZoom.enable(); });
 
    mapEl.classList.add("has-map");
  }
 
  document.addEventListener("DOMContentLoaded", initMap);
})();