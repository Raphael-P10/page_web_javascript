let allWorks = [];
const token = localStorage.getItem("token");

// Récupération et affichage des projets
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        allWorks = works;
        const gallery = document.querySelector(".gallery");

        if (gallery) {
            works.forEach(work => {
                const figure = document.createElement("figure");
                figure.innerHTML = `
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <figcaption>${work.title}</figcaption>
                `;
                gallery.appendChild(figure);
            });
        }
    });

// Récupération des catégories
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        const filters = document.querySelector(".filters");
        const categorySelect = document.querySelector("#category");

        if (filters) {
            const buttonTous = document.createElement("button");
            buttonTous.textContent = "Tous";
            buttonTous.onclick = () => filterWorkByCategory(null);
            filters.appendChild(buttonTous);
        }

        categories.forEach(category => {
            if (filters) {
                const button = document.createElement("button");
                button.textContent = category.name;
                button.onclick = () => filterWorkByCategory(category.id);
                filters.appendChild(button);
            }

            if (categorySelect) {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            }
        });
    });

// Filtrage des projets
function filterWorkByCategory(categoryId) {
    document.querySelectorAll(".gallery figure").forEach(figure => {
        const title = figure.querySelector("figcaption").textContent;
        const work = allWorks.find(work => work.title === title);

        figure.style.display =
            categoryId === null || work.categoryId === categoryId ? "" : "none";
    });
}

// Connexion
const loginForm = document.querySelector("#login-form");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
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

// Mode édition et déconnexion
const editionMode = document.querySelector("#edition-mode");
const filters = document.querySelector(".filters");
const editButton = document.querySelector("#edit-button");
const login = document.querySelector("#login");

if (token) {
    if (editionMode) editionMode.style.display = "block";
    if (filters) filters.style.display = "none";
    if (editButton) editButton.style.display = "block";

    if (login) {
        login.textContent = "logout";
        login.href = "#";
        login.onclick = () => {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        };
    }
}

// Première modale
const modal = document.querySelector("#modal");
const modalGallery = document.querySelector("#modal-gallery");

if (token && editButton && modal) {
    editButton.onclick = () => {
        modal.style.display = "block";
        modalGallery.innerHTML = "";

        allWorks.forEach(work => {
            const container = document.createElement("div");
            container.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <button><i class="fa-solid fa-trash-can"></i></button>
            `;

            container.querySelector("button").onclick = () => alert(work.id);
            modalGallery.appendChild(container);
        });
    };
}

const closeModal = document.querySelector("#close-modal");

if (closeModal) {
    closeModal.onclick = () => modal.style.display = "none";
}

// Deuxième modale
const addPhotoButton = document.querySelector("#add-photo-button");
const addModal = document.querySelector("#add-modal");
const backModal = document.querySelector("#back-modal");
const closeAddModal = document.querySelector("#close-add-modal");

if (addPhotoButton) {
    addPhotoButton.onclick = () => {
        modal.style.display = "none";
        addModal.style.display = "flex";
    };
}

if (backModal) {
    backModal.onclick = () => {
        addModal.style.display = "none";
        modal.style.display = "block";
    };
}

if (closeAddModal) {
    closeAddModal.onclick = () => addModal.style.display = "none";
}

// Ajout d'une photo
const addPhotoForm = document.querySelector("#add-photo-form");

if (addPhotoForm) {
    addPhotoForm.onsubmit = event => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", document.querySelector("#photo").files[0]);
        formData.append("title", document.querySelector("#title").value);
        formData.append("category", document.querySelector("#category").value);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Authorization": "Bearer " + token },
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(() => {
            alert("Photo ajoutée !");
            window.location.reload();
        })
        .catch(() => alert("Erreur lors de l'ajout de la photo"));
    };
}
