fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
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
        filters.appendChild(buttonTous);

        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.onclick = function () {filterWorkByCategory(category.id)};
            filters.appendChild(button);
        });
    });

function filterWorkByCategory(categoryId) {
    alert(categoryId); 
}