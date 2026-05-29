const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortOrder = document.getElementById("sortOrder");


let pokemonsList = [];

function renderPokemons(list) {
    list.forEach(pokemon => {
        pokemonList.innerHTML +=

            `<div class="card col-2" style="width: 14rem;">
                <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="">
                    <div class="card-body">
                        <a class="btn btn-secondary" >${pokemon.id}</a>
                        <button onclick="openModal(${pokemon.id})" class="btn btn-secondary">${pokemon.name}</button>
                    </div>
            </div>`
    });
};

function openModal(id) {
    const pokemon = pokemonsList.find(Modal => Modal.id === id);
    console.log(pokemon);

    const modal = new bootstrap.Modal(document.getElementById("modal"));

    document.getElementById("pokemon.name");
    document.getElementById("pokemon.height");
    document.getElementById("pokemon.weight");
    // Usar map para descobrir o tipo do pokemon

    modal.show();
};

// function searchInput(text){

// }

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

getPokemons();