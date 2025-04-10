const form = document.getElementById("productForm");
const msg = document.getElementById("responseMsg");
const categorySelect = document.getElementById("category");

// Fetch categories and populate select dropdown
async function loadCategories() {
  try {
    const res = await fetch(
      "https://shopngo-backend.onrender.com/products/categories"
    );
    const data = await res.json();

    if (Array.isArray(data)) {
      data.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    } else {
      throw new Error("Invalid category data");
    }
  } catch (err) {
    console.error("Error loading categories:", err);
    const errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Failed to load categories";
    categorySelect.appendChild(errorOption);
  }
}

// Submit product form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name.value.trim());
  formData.append("description", form.description.value.trim());
  formData.append("price", form.price.value);
  formData.append("category", form.category.value);
  formData.append("stock", form.stock.value);
  formData.append("weight", form.weight.value.trim());

  const imageFile = form.image.files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const res = await fetch(
      "https://shopngo-backend.onrender.com/products/create",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    msg.style.color = "green";
    msg.textContent = "✅ Product created successfully!";
    form.reset();
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = `❌ ${err.message}`;
  }
});

// Load categories on page load
window.addEventListener("DOMContentLoaded", loadCategories);
