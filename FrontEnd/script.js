let allWorks = [];

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        allWorks = works;
        const gallery = document.querySelector(".gallery");

        works.forEach(work => {
            const figure = document.createElement("figure");

            const image = document.createElement("img");
            image.src = work.imageUrl;
            image.alt = work.title;

            const caption = document.createElement("figcaption");
            caption.textContent = work.title;

            figure.appendChild(image);
            figure.appendChild(caption);

            gallery.appendChild(figure);
        });
    });

fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        const filters = document.querySelector(".filters");

        const buttonTous = document.createElement("button");
        buttonTous.textContent = "Tous";
        buttonTous.onclick = function () {
            filterWorkByCategory(null);
        };

        filters.appendChild(buttonTous);

        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.onclick = function () { filterWorkByCategory(category.id) };
            filters.appendChild(button);
        });
    });

function filterWorkByCategory(categoryId) {
    const figures = document.querySelectorAll(".gallery figure");

    figures.forEach(figure => {
        const work = allWorks.find(work => work.title === figure.querySelector("figcaption").textContent);

        if (categoryId === null || work.categoryId === categoryId) {
            figure.style.display = "";
        } else {
            figure.style.display = "none";
        }
    });

}

const loginForm = document.querySelector("#login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.querySelector("#email").value,
                password: document.querySelector("#password").value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "index.html";
                } else {
                    alert("Identifiants incorrects");
                }
            });
    });
}

const editionMode = document.querySelector("#edition-mode");
const token = localStorage.getItem("token");
const filters = document.querySelector(".filters");
const editButton = document.querySelector("#edit-button");

if (token) {
    if (editionMode) {
        editionMode.style.display = "block";
    }

    if (filters) {
        filters.style.display = "none";
    }

    if (editButton) {
        editButton.style.display = "block";
    }
}

const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#close-modal");
const modalGallery = document.querySelector("#modal-gallery");

// Ouvrir la modale
if (token && editButton && modal) {
    editButton.addEventListener("click", function () {
        modal.style.display = "block";

        modalGallery.innerHTML = "";

        allWorks.forEach(work => {
            const container = document.createElement("div");

            const image = document.createElement("img");
            image.src = work.imageUrl;
            image.alt = work.title;

            const button = document.createElement("button");
            button.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

            container.appendChild(image);
            container.appendChild(button);

            modalGallery.appendChild(container);
        });
    });
}

// Fermer la modale
if (closeModal && modal) {
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });
}

const login = document.querySelector("#login");

if (token && login) {
    login.textContent = "logout";
    login.href = "#";

    login.addEventListener("click", function() {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
}