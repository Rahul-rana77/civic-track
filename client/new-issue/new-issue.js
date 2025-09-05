let button = document.getElementById("btn");

document.getElementById('issue-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('location', document.getElementById('location').value);
  formData.append('isAnonymous', document.getElementById('anonymous').checked);
  formData.append('photo', document.getElementById('photo').files[5]);

  try {
    const res = await fetch('https://civic-track-55yd.onrender.com/api/issues', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    alert('Issue submitted successfully!');
    window.location.href = "/home/home.html";

  } catch (error) {
    console.error('Error:', error);
  }
});

function back() {
  window.location.href = "/home/home.html";
}

button.addEventListener("click",back);