document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById("preloader");
    window.onload = function () {
        preloader.style.display = "none";
    };
    function togglePage(pageId) {
        document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
        document.getElementById(pageId).classList.remove("hidden");

        document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
        document.querySelector(`[onclick="togglePage('${pageId}')"]`).classList.add("active");
    }
    window.togglePage = togglePage;
    const darkModeToggle = document.getElementById("darkModeToggle");
    function setDarkMode(enabled) {
        document.body.classList.toggle("dark-mode", enabled);
        localStorage.setItem("darkMode", enabled);
    }
    darkModeToggle.addEventListener("click", function () {
        setDarkMode(!document.body.classList.contains("dark-mode"));
    });
    if (localStorage.getItem("darkMode") === "true") setDarkMode(true);
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", function () {
        backToTop.classList.toggle("show", window.scrollY > 300);
    });
    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    let cart = [];
    function addToCart(itemName, itemPrice) {
        cart.push({ name: itemName, price: itemPrice });
        updateCart();
        showNotification(`${itemName} added to cart!`);
    }
    function updateCart() {
        const cartItemsContainer = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        cartItemsContainer.innerHTML = "";

        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="cart-item">Your cart is empty.</div>`;
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <span>${item.name} - ₹${item.price.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
    }
    window.removeFromCart = function (index) {
        const removedItem = cart[index].name;
        cart.splice(index, 1);
        updateCart();
        showNotification(`${removedItem} removed from cart!`);
    };
    function showNotification(message) {
        let notification = document.createElement("div");
        notification.classList.add("cart-notification");
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("fade-out");
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
    document.getElementById("checkout-btn").addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            alert("Proceeding to checkout!");
            cart = [];
            updateCart();
        }
    });
    document.querySelector(".btn").addEventListener("click", function (event) {
        event.preventDefault();
        togglePage("menu");
    });
    document.querySelectorAll(".menu-card").forEach(card => {
        card.addEventListener("click", function () {
            let itemName = card.querySelector("h3").textContent;
            let itemPrice = parseFloat(card.querySelector(".price").textContent.replace("₹", "").trim());
            addToCart(itemName, itemPrice);
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const formSuccess = document.getElementById("formSuccess");
    const messagesContainer = document.getElementById("messagesContainer");
    function validateForm() {
        let isValid = true;
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        if (nameInput.value.trim() === "") {
            nameError.textContent = "Name is required!";
            isValid = false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailInput.value.trim() === "") {
            emailError.textContent = "Email is required!";
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = "Please enter a valid email address!";
            isValid = false;
        }
        if (messageInput.value.trim() === "") {
            messageError.textContent = "Message is required!";
            isValid = false;
        }

        return isValid;
    }
    function saveToLocalStorage(name, email, message) {
        const contactData = { name, email, message };
        const storedMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];
        storedMessages.push(contactData);
        localStorage.setItem("contactMessages", JSON.stringify(storedMessages));
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (validateForm()) {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            saveToLocalStorage(name, email, message);

            formSuccess.textContent = "Thank you for your message! We will get back to you soon.";
            formSuccess.style.color = "green";
            contactForm.reset();
            setTimeout(() => {
                formSuccess.textContent = '';
            }, 5000);
        }
    });
    function displayMessages() {
        const storedMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];
        
        if (storedMessages.length === 0) {
            messagesContainer.innerHTML = "<p>No contact messages found.</p>";
        } else {
            messagesContainer.innerHTML = ""; 

            storedMessages.forEach((messageData, index) => {
                const messageDiv = document.createElement("div");
                messageDiv.classList.add("message-item");
                messageDiv.innerHTML = `
                    <h3>${messageData.name} <span>(${messageData.email})</span></h3>
                    <p>${messageData.message}</p>
                    <button class="delete-btn" onclick="deleteMessage(${index})">Delete</button>
                    <hr>
                `;
                messagesContainer.appendChild(messageDiv);
            });
        }
    }
    window.deleteMessage = function (index) {
        const storedMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];
        storedMessages.splice(index, 1);
        localStorage.setItem("contactMessages", JSON.stringify(storedMessages));
        displayMessages();
    }
    displayMessages();
});
