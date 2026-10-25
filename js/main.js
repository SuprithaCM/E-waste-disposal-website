$(function () {
  // Responsive navigation
  $(".menu-toggle").on("click", function () {
    const open = $(".nav-links").toggleClass("nav-open").hasClass("nav-open");
    $(this).attr("aria-expanded", open ? "true" : "false");
  });

  // E-waste catalogue search
  $("#catalogueSearch").on("input", function () {
    const query = $(this).val().trim().toLowerCase();
    let visible = 0;
    $(".waste-card").each(function () {
      const match = ($(this).text() + " " + ($(this).data("search") || "")).toLowerCase().includes(query);
      $(this).toggle(match);
      if (match) visible++;
    });
    $("#noResults").toggleClass("hidden", visible > 0);
  });

  // Sample collector finder. Browser geolocation only provides coordinates; it does not find live collectors.
  function showCollectorMessage(message, type) {
    $("#locationMessage").text(message).removeClass("success error").addClass(type || "");
  }
  function filterCollectors(query, isGps) {
    const q = (query || "").toLowerCase().trim();
    let shown = 0;
    $(".collector-card").each(function () {
      const match = !q || ($(this).text() + " " + ($(this).data("area") || "")).toLowerCase().includes(q);
      $(this).toggle(match);
      if (match) shown++;
    });
    $("#collectorEmpty").toggleClass("hidden", shown > 0);
    $("#resultsTitle").text(q ? "Sample results for " + (isGps ? "your location" : query) : "Example collection options");
    if (isGps) {
      showCollectorMessage("Your browser location was accessed. This demo cannot look up real nearby collectors; displayed sample listings are not matched by actual distance.", "success");
    } else if (q) {
      showCollectorMessage("Showing sample listings that match your city/PIN search. This is not a live or verified directory.", "success");
    } else {
      showCollectorMessage("Showing all sample listings.", "");
    }
  }
  $("#locationForm").on("submit", function (event) {
    event.preventDefault();
    const query = $("#locationInput").val().trim();
    if (!query) return;
    filterCollectors(query, false);
  });
  $("#useLocation").on("click", function () {
    if (!navigator.geolocation) {
      showCollectorMessage("This browser does not support geolocation. Enter your city or PIN code instead.", "error");
      return;
    }
    const $button = $(this);
    $button.prop("disabled", true).text("Requesting location…");
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude.toFixed(3);
      const lon = position.coords.longitude.toFixed(3);
      $button.prop("disabled", false).html("⌖ Use my current location");
      filterCollectors("", true);
      showCollectorMessage("Location permission granted (approx. " + lat + ", " + lon + "). Live reverse geocoding and verified nearby collector matching are not configured in this demo.", "success");
    }, function (error) {
      $button.prop("disabled", false).html("⌖ Use my current location");
      const message = error.code === 1 ? "Location permission was denied. You can search by city or PIN code instead." : "Could not get your location. Check browser permissions or search by city/PIN code.";
      showCollectorMessage(message, "error");
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  });

  // E-waste payout calculator — deliberately illustrative sample rates in INR per kg.
  const rates = {
    phone: { label: "Mobile phones & small gadgets", low: 80, high: 250 },
    laptop: { label: "Laptops", low: 100, high: 350 },
    desktop: { label: "Desktop computers", low: 60, high: 180 },
    monitor: { label: "Monitors & TVs", low: 10, high: 70 },
    cable: { label: "Cables & wires", low: 40, high: 180 },
    printer: { label: "Printers", low: 5, high: 35 },
    battery: { label: "Batteries & power banks", low: 0, high: 80 },
    appliance: { label: "Small home appliances", low: 10, high: 60 },
    router: { label: "Routers & networking", low: 20, high: 100 },
    mixed: { label: "Mixed electronic scrap", low: 5, high: 50 }
  };
  let items = [];
  function money(value) {
    return "₹" + Math.round(value).toLocaleString("en-IN");
  }
  function totals() {
    return items.reduce((acc, item) => {
      acc.weight += item.weight;
      acc.low += item.weight * item.low;
      acc.high += item.weight * item.high;
      return acc;
    }, { weight: 0, low: 0, high: 0 });
  }
  function renderItems() {
    const $tbody = $("#wasteItems");
    $tbody.empty();
    if (!items.length) {
      $tbody.append('<tr class="empty-row"><td colspan="4">Your e-waste list is empty. Add an item above to begin.</td></tr>');
    } else {
      items.forEach((item, index) => {
        $tbody.append("<tr><td>" + $("<div>").text(item.label).html() + "</td><td>" + item.weight.toFixed(1) + " kg</td><td>" + money(item.weight * item.low) + "–" + money(item.weight * item.high) + "</td><td><button class='remove-item' type='button' data-index='" + index + "' aria-label='Remove " + $("<div>").text(item.label).html() + "'>×</button></td></tr>");
      });
    }
    const total = totals();
    const weight = total.weight.toFixed(1) + " kg";
    const estimate = money(total.low) + " – " + money(total.high);
    $("#totalWeight, #sideWeight").text(weight);
    $("#totalEstimate, #sideEstimate").text(estimate);
    $("#itemCount").text(items.length);
  }
  $("#addWaste").on("click", function () {
    const type = $("#wasteType").val();
    const weight = parseFloat($("#wasteWeight").val());
    if (!Number.isFinite(weight) || weight <= 0 || weight > 10000) {
      alert("Please enter a valid weight greater than 0 and no more than 10,000 kg.");
      $("#wasteWeight").trigger("focus");
      return;
    }
    items.push({ type, label: rates[type].label, weight, low: rates[type].low, high: rates[type].high });
    renderItems();
  });
  $("#wasteItems").on("click", ".remove-item", function () {
    items.splice(Number($(this).data("index")), 1);
    renderItems();
  });

  // Set minimum date to today and preselect method from a query string.
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $("#preferredDate").attr("min", localToday);
  const params = new URLSearchParams(window.location.search);
  if (params.get("method") === "dropoff") $("input[name='method'][value='dropoff']").prop("checked", true);
  if (params.get("method") === "pickup") $("input[name='method'][value='pickup']").prop("checked", true);

  $("#pickupForm").on("submit", function (event) {
    event.preventDefault();
    if (!items.length) {
      $("#requestMessage").removeClass("hidden success").addClass("error").text("Please add at least one e-waste item before previewing your request.");
      return;
    }
    const method = $("input[name='method']:checked").val() === "pickup" ? "Home pickup" : "Drop-off centre";
    const total = totals();
    const name = $("#fullName").val().trim();
    const msg = "Demo request preview for " + name + ": " + method + ", " + items.length + " item type(s), " + total.weight.toFixed(1) + " kg, illustrative estimate " + money(total.low) + " – " + money(total.high) + ". No request has been sent or booked.";
    $("#requestMessage").removeClass("hidden error").addClass("success").text(msg);
    $("#requestMessage").attr("tabindex", "-1").trigger("focus");
  });
});