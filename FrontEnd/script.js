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