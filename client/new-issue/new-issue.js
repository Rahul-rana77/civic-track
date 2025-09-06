const API_URL = "https://civic-track-55yd.onrender.com/api/issues"; // Render backend

document.getElementById('issue-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('location', document.getElementById('location').value);
  formData.append('isAnonymous', document.getElementById('anonymous').checked);

  const photoInput = document.getElementById('photo');
  if (photoInput.files.length > 0) {
    formData.append('photo', photoInput.files[0]);
  }

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`❌ Failed: ${res.status} → ${errText}`);
    }

    const data = await res.json();
    alert("✅ Issue submitted successfully!");
    window.location.href = "/home/home.html"; 
  } catch (err) {
    console.error("❌ Error submitting issue:", err);
    alert("Error submitting issue. Check console logs.");
  }
});

// back button
document.getElementById("btn").addEventListener("click", () => {
  window.location.href = "/home/home.html";
});
