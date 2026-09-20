/*
  BHARDWAJ'S SWEETS - SIMPLE SHOPPING WEBSITE

  This file controls:
  1. Showing the sweet products
  2. Searching and filtering products
  3. Adding products to the shopping bag
  4. Opening and closing the cart
  5. Showing the checkout form

  The products are stored in this file for now.
  A real shop would usually get this information from a database.
*/

// -----------------------------
// Product information
// -----------------------------

var products = [
  {
    id: 1,
    name: "Elaichi Shrikhand",
    category: "signature",
    details: "250g · serves 4–5",
    price: 595,
    badge: "Bestseller",
    image: "https://brijwasioriginal.com/assets/images/slice/our_products/shrikhand/04_elaichi_shrikhand.jpg"
  },
  {
    id: 2,
    name: "Special Motichoor Laddoo",
    category: "laddoo",
    details: "6 pieces · 300g",
    price: 445,
    badge: "Most loved",
    image: "https://brijwasioriginal.com/assets/images/slice/our_products/mawa-design-sweets/01_sp_motichoor_ladoo.jpg"
  },
  {
    id: 3,
    name: "Kaju Katli",
    category: "barfi",
    details: "250g · serves 4–5",
    price: 650,
    badge: "Classic",
    image: "https://static.toiimg.com/thumb/55048826.cms?width=1200&height=900"
  },
  {
    id: 4,
    name: "The Celebration Box",
    category: "gifting",
    details: "16 pieces · 450g",
    price: 1295,
    badge: "Gift favourite",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    name: "Rasgulla",
    category: "signature",
    details: "4 pieces · chilled",
    price: 495,
    badge: "Fresh today",
    image: "https://brijwasioriginal.com/assets/images/slice/our_products/bengali_sweets/11_rasgulla.jpg"
  },
  {
    id: 6,
    name: "Besan Ghee Laddoo",
    category: "laddoo",
    details: "6 pieces · 300g",
    price: 395,
    badge: "Grandma's recipe",
    image: "https://humbleflavors.com/cdn/shop/products/Besan_1024x1024px.jpg?v=1663336102"
  },
  {
    id: 7,
    name: "Rose Coconut Barfi",
    category: "barfi",
    details: "250g · serves 4–5",
    price: 475,
    badge: "New",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuSaeKdJoV6rcxdRIUeiVVkmwo4LiQT_0Is4vSZ7rM2NmbcUs1aFMbrjeO&s=10"
  },
  {
    id: 8,
    name: "The Little Joy Box",
    category: "gifting",
    details: "9 pieces · 250g",
    price: 795,
    badge: "Sweet pick",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85"
  },
   {
    id: 9,
    name: "Special Samosa ",
    category: "signature",
    details: "1 pieces · 60g",
    price: 50,
    badge: "Sweet pick",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSow8wiUuIxjfEToV69JWVUKXnNmisjibteHRz3SiFsXMpPswQFhS9QQ&s=10"
  }
];

// -----------------------------
// Website state
// -----------------------------

var cart = loadCart();
var activeCategory = "all";
var searchText = "";
var toastTimer;

// These elements are used often, so we save them in variables.
var productGrid = document.getElementById("product-grid");
var emptyState = document.getElementById("empty-state");
var cartDrawer = document.getElementById("cart-drawer");
var cartOverlay = document.getElementById("cart-overlay");
var cartContent = document.getElementById("cart-content");
var cartFooter = document.getElementById("cart-footer");
var cartCount = document.getElementById("cart-count");
var drawerCount = document.getElementById("drawer-count");

// -----------------------------
// Small helper functions
// -----------------------------

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

function findProduct(productId) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      return products[i];
    }
  }

  return null;
}

function loadCart() {
  var savedCart = localStorage.getItem("mithai-cart");

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart);
  } catch (error) {
    // If the saved data is damaged, start with an empty bag.
    return [];
  }
}

function saveCart() {
  localStorage.setItem("mithai-cart", JSON.stringify(cart));
}

function showToast(message) {
  var toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("visible");
  }, 2400);
}

// -----------------------------
// Product section
// -----------------------------

function getProductsToShow() {
  var productsToShow = [];
  var lowercaseSearch = searchText.toLowerCase();

  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    var isInCategory = activeCategory === "all" || product.category === activeCategory;
    var productText = (product.name + " " + product.category + " " + product.details).toLowerCase();
    var matchesSearch = productText.includes(lowercaseSearch);

    if (isInCategory && matchesSearch) {
      productsToShow.push(product);
    }
  }

  return productsToShow;
}

function makeProductCard(product) {
  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
        <button class="wishlist" data-product-id="${product.id}" aria-label="Add ${product.name} to wishlist">♡</button>
      </div>
      <div class="product-details">
        <h3>${product.name}</h3>
        <div class="product-meta">
          <p>${product.details}</p>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <button class="add-button" data-product-id="${product.id}">
          Add to bag <span>+</span>
        </button>
      </div>
    </article>
  `;
}

function renderProducts() {
  var productsToShow = getProductsToShow();
  var productHTML = "";

  for (var i = 0; i < productsToShow.length; i++) {
    productHTML += makeProductCard(productsToShow[i]);
  }

  productGrid.innerHTML = productHTML;
  emptyState.hidden = productsToShow.length !== 0;

  // The buttons are created above, so we add their click events now.
  addProductButtonEvents();
  addWishlistButtonEvents();
}

function addProductButtonEvents() {
  var addButtons = document.querySelectorAll(".add-button");

  for (var i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener("click", function () {
      var productId = Number(this.getAttribute("data-product-id"));
      addToCart(productId);
    });
  }
}

function addWishlistButtonEvents() {
  var wishlistButtons = document.querySelectorAll(".wishlist");

  for (var i = 0; i < wishlistButtons.length; i++) {
    wishlistButtons[i].addEventListener("click", function () {
      this.classList.toggle("active");

      if (this.classList.contains("active")) {
        this.textContent = "♥";
        showToast("Saved to your favourites");
      } else {
        this.textContent = "♡";
        showToast("Removed from favourites");
      }
    });
  }
}

function chooseCategory(categoryName) {
  activeCategory = categoryName;

  var categoryButtons = document.querySelectorAll(".category-tab");
  for (var i = 0; i < categoryButtons.length; i++) {
    var buttonCategory = categoryButtons[i].getAttribute("data-category");
    categoryButtons[i].classList.toggle("active", buttonCategory === categoryName);
  }

  renderProducts();
}

// -----------------------------
// Shopping cart
// -----------------------------

function getCartItemCount() {
  var itemCount = 0;

  for (var i = 0; i < cart.length; i++) {
    itemCount += cart[i].quantity;
  }

  return itemCount;
}

function getCartTotal() {
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    var product = findProduct(cart[i].id);

    if (product) {
      total += product.price * cart[i].quantity;
    }
  }

  return total;
}

function addToCart(productId) {
  var existingItem = null;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      existingItem = cart[i];
      break;
    }
  }

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();

  var product = findProduct(productId);
  showToast(product.name + " added to your bag");
}

function changeQuantity(productId, amount) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity += amount;

      if (cart[i].quantity <= 0) {
        cart.splice(i, 1);
      }

      break;
    }
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart.splice(i, 1);
      break;
    }
  }

  saveCart();
  renderCart();
}

function makeCartItem(cartItem) {
  var product = findProduct(cartItem.id);

  return `
    <div class="cart-line">
      <div class="cart-line-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div>
        <h3>${product.name}</h3>
        <p>${formatPrice(product.price)} · ${product.details.split(" · ")[0]}</p>
        <div class="qty-control">
          <button class="quantity-button" data-product-id="${product.id}" data-amount="-1" aria-label="Decrease quantity">−</button>
          <span>${cartItem.quantity}</span>
          <button class="quantity-button" data-product-id="${product.id}" data-amount="1" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-line" data-product-id="${product.id}">Remove</button>
      </div>
      <span class="cart-line-price">${formatPrice(product.price * cartItem.quantity)}</span>
    </div>
  `;
}

function renderCart() {
  var itemCount = getCartItemCount();
  var total = getCartTotal();

  cartCount.textContent = itemCount;
  drawerCount.textContent = "(" + itemCount + ")";

  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="cart-empty">
        <span>✦</span>
        <h3>Your bag is waiting.</h3>
        <p>Add something sweet to get started.</p>
      </div>
    `;
    cartFooter.innerHTML = "";
    return;
  }

  var cartHTML = "";
  for (var i = 0; i < cart.length; i++) {
    cartHTML += makeCartItem(cart[i]);
  }
  cartContent.innerHTML = cartHTML;

  var amountLeft = 999 - total;
  if (amountLeft < 0) {
    amountLeft = 0;
  }

  var progress = (total / 999) * 100;
  if (progress > 100) {
    progress = 100;
  }

  var deliveryMessage = "";
  if (amountLeft > 0) {
    deliveryMessage = "Add <strong>" + formatPrice(amountLeft) + "</strong> more for free delivery";
  } else {
    deliveryMessage = "<strong>Free delivery unlocked!</strong>";
  }

  cartFooter.innerHTML = `
    <div class="shipping-message">
      ${deliveryMessage}
      <div class="progress-track"><span style="width: ${progress}%"></span></div>
    </div>
    <div class="summary-row">
      <span>Subtotal</span>
      <strong>${formatPrice(total)}</strong>
    </div>
    <button class="button button-primary full-button" id="checkout-button">
      Continue to checkout <span>↗</span>
    </button>
  `;

  addCartButtonEvents();
}

function addCartButtonEvents() {
  var quantityButtons = document.querySelectorAll(".quantity-button");
  var removeButtons = document.querySelectorAll(".remove-line");
  var checkoutButton = document.getElementById("checkout-button");

  for (var i = 0; i < quantityButtons.length; i++) {
    quantityButtons[i].addEventListener("click", function () {
      var productId = Number(this.getAttribute("data-product-id"));
      var amount = Number(this.getAttribute("data-amount"));
      changeQuantity(productId, amount);
    });
  }

  for (var j = 0; j < removeButtons.length; j++) {
    removeButtons[j].addEventListener("click", function () {
      var productId = Number(this.getAttribute("data-product-id"));
      removeFromCart(productId);
    });
  }

  checkoutButton.addEventListener("click", openCheckout);
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// -----------------------------
// Checkout window
// -----------------------------

var checkoutOverlay = document.getElementById("checkout-overlay");
var checkoutForm = document.getElementById("checkout-form");
var checkoutHeading = document.querySelector(".checkout-heading");
var orderSuccess = document.getElementById("order-success");

function openCheckout() {
  closeCart();

  // Reset the window in case the customer places another order later.
  checkoutForm.hidden = false;
  checkoutHeading.hidden = false;
  orderSuccess.hidden = true;

  checkoutOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  checkoutOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

function finishOrder(event) {
  event.preventDefault();

  checkoutForm.hidden = true;
  checkoutHeading.hidden = true;
  orderSuccess.hidden = false;

  cart = [];
  saveCart();
  renderCart();
}

// -----------------------------
// Event listeners
// -----------------------------

var categoryTabs = document.getElementById("category-tabs");
categoryTabs.addEventListener("click", function (event) {
  var clickedButton = event.target.closest(".category-tab");

  if (clickedButton) {
    chooseCategory(clickedButton.getAttribute("data-category"));
  }
});

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

var searchPanel = document.getElementById("search-panel");
var searchInput = document.getElementById("search-input");

document.querySelector(".search-toggle").addEventListener("click", function () {
  searchPanel.classList.toggle("open");

  if (searchPanel.classList.contains("open")) {
    searchInput.focus();
  }
});

document.getElementById("close-search").addEventListener("click", function () {
  searchPanel.classList.remove("open");
});

searchInput.addEventListener("input", function () {
  searchText = searchInput.value;
  activeCategory = "all";
  chooseCategory("all");
});

document.getElementById("reset-search").addEventListener("click", function () {
  searchText = "";
  searchInput.value = "";
  chooseCategory("all");
});

document.getElementById("close-checkout").addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", function (event) {
  if (event.target === checkoutOverlay) {
    closeCheckout();
  }
});

checkoutForm.addEventListener("submit", finishOrder);
document.getElementById("continue-shopping").addEventListener("click", closeCheckout);

document.getElementById("newsletter-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var newsletterMessage = document.getElementById("newsletter-message");
  newsletterMessage.textContent = "You're on the list — see you in your inbox!";
  newsletterMessage.style.color = "#fff";
  event.target.reset();
});

document.querySelector(".announcement-close").addEventListener("click", function () {
  this.parentElement.remove();
});

document.getElementById("mobile-menu").addEventListener("click", function () {
  showToast("Menu links are available in the navigation above");
});

// Show the page for the first time.
renderProducts();
renderCart();