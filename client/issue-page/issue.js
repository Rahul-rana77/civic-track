async function getLatLong(location) {
  if (!location) return null;

  // Clean up location string
  const cleanLocation = location
    .replace(/\s*,\s*/g, ", ") // normalize commas
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();

  console.log("Searching for location:", cleanLocation);

  const URL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanLocation)}`;

  try {
    const res = await fetch(URL);
    const data = await res.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    } else {
      console.warn("No results for:", cleanLocation);
      return null;
    }
  } catch (err) {
    console.error("Error fetching coordinates:", err);
    return null;
  }
}

// 2. Load issue details & show map
async function loadIssue() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {
    const res = await fetch("http://localhost:8000/api/issues");
    const issues = await res.json();
    console.log("Issues fetched:", issues);

    const issue = issues.find(i => i.id == id);
    if (!issue) {
      document.querySelector('.container').innerHTML = "<p>Issue not found.</p>";
      return;
    }

    // Fill details
    document.getElementById("issueTitle").textContent = issue.title;
    document.getElementById("issueStatus").textContent = issue.status || 'Reported';
    document.getElementById("issueStatus").classList.add(issue.status?.toLowerCase().replace(" ", "-"));
    document.getElementById("issueCategory").textContent = issue.category;
    document.getElementById("issueDate").textContent = new Date(issue.createdAt || Date.now()).toLocaleDateString();
    document.getElementById("issueLocation").textContent = issue.location;
    document.getElementById("issueDescription").textContent = issue.description || "No description provided";

    // Image
    const imageUrl = issue.photoUrl
      ? `http://localhost:8000${issue.photoUrl}`
      : "https://via.placeholder.com/600x300?text=No+Image";
    document.getElementById("issueImage").src = imageUrl;

    // Get coordinates and show map
    const coords = await getLatLong(issue.location);
    console.log(coords)
    if (coords) {
      initMap(coords.lat, coords.lon, issue.title);
    } else {
      document.getElementById("map").innerHTML = "<p>Map location not available</p>";
    }

  } catch (err) {
    console.error("❌ Error fetching issue:", err);
    document.querySelector('.container').innerHTML = "<p>Error loading issue.</p>";
  }
}

// 3. Initialize Leaflet map
function initMap(lat, lon, title) {
  const map = L.map('map').setView([lat, lon], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup(`<b>${title}</b><br>${lat.toFixed(5)}, ${lon.toFixed(5)}`)
    .openPopup();
}

// 4. Start on load
window.onload = loadIssue;
