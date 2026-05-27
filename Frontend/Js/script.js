const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortOrder = document.getElementById("sortOrder");


let pokemonsList = [];

function renderPokemons(list) {
    list.forEach(pokemon => {
        pokemonList.innerHTML +=

            `<div class = "col-2">
                <div class = "card">
                    <img src = "${pokemon.sprites.front_default}" class = "card-img-top">
                        <div class = "card-body">
                                <p>${pokemon.id}</p>
                                <h5 class = "card-title">${pokemon.nome}</h5>
                        </div>
                </div>
            </div>`
    });
};

async function getPokemons() {
    const request = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
    const response = await request.json();

    const mapList = response.results.map(async (pokemon) => {
        const request = await fetch(pokemon.url);
        return await request.json();
    });

    pokemonsList = await Promise.all(mapList);
    renderPokemons(pokemonsList);
};

function updateList() {
};

function openModal(id) {
};

getPokemons();