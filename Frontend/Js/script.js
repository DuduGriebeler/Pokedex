const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortOrder = document.getElementById("sortOrder");

let pokemonsList = [];

function renderPokemons(listaDePokemons) {
    pokemonList.innerHTML = "";

    listaDePokemons.forEach(pokemon => {
        pokemonList.innerHTML += `
            <div class="card col-2 m-2" style="width: 14rem;">
                <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body text-center">
                    <a class="btn btn-secondary mb-1">#${pokemon.id}</a>
                    <button onclick="openModal(${pokemon.id})" class="btn btn-secondary text-capitalize">${pokemon.name}</button>
                </div>
            </div>
        `;
    });
}

function openModal(idDoPokemonSelecionado) {

    const pokemonEncontrado = pokemonsList.find(pokemon => pokemon.id === idDoPokemonSelecionado);

    if (!pokemonEncontrado) return;

    const listaDeTiposFormatada = pokemonEncontrado.types.map(objetoTipo => objetoTipo.type.name).join(', ');

    document.getElementById("modalName").innerText = pokemonEncontrado.name.toUpperCase();
    document.getElementById("modalHeight").innerText = `Altura: ${pokemonEncontrado.height / 10} m`;
    document.getElementById("modalWeight").innerText = `Peso: ${pokemonEncontrado.weight / 10} kg`;
    document.getElementById("modalTypes").innerText = `Tipos: ${listaDeTiposFormatada}`;

    const modalElement = document.getElementById("modal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function updateList() {
    let listaFiltrada = [...pokemonsList];

    const termoDeBusca = searchInput.value.toLowerCase().trim();
    if (termoDeBusca !== "") {  
        listaFiltrada = listaFiltrada.filter(pokemon =>
            pokemon.name.toLowerCase().includes(termoDeBusca) ||
            pokemon.id.toString() === termoDeBusca
        );
    }

    const tipoSelecionado = typeFilter.value;
    if (tipoSelecionado !== "") {
        listaFiltrada = listaFiltrada.filter(pokemon =>
            pokemon.types.some(objetoTipo => objetoTipo.type.name === tipoSelecionado)
        );
    }

    const ordenacaoSelecionada = sortOrder.value;
    if (ordenacaoSelecionada === "id-Crescente") {
        listaFiltrada.sort((primeiroPokemon, segundoPokemon) => primeiroPokemon.id - segundoPokemon.id);
    }
    else
        if (ordenacaoSelecionada === "id-Decrescente") {
            listaFiltrada.sort((primeiroPokemon, segundoPokemon) => segundoPokemon.id - primeiroPokemon.id);
        }
        else
            if (ordenacaoSelecionada === "name-Crescente") {
                listaFiltrada.sort((primeiroPokemon, segundoPokemon) => primeiroPokemon.name.localeCompare(segundoPokemon.name));
            }
            else
                if (ordenacaoSelecionada === "name-Decrescente") {
                    listaFiltrada.sort((primeiroPokemon, segundoPokemon) => segundoPokemon.name.localeCompare(primeiroPokemon.name));
                }

    renderPokemons(listaFiltrada);
}

searchInput.addEventListener("input", updateList);
typeFilter.addEventListener("change", updateList);
sortOrder.addEventListener("change", updateList);

async function getPokemons() {
    const requisicaoInicial = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
    const respostaInicial = await requisicaoInicial.json();

    const listaDePromessas = respostaInicial.results.map(async (pokemonGenerico) => {
        const requisicaoDetalhes = await fetch(pokemonGenerico.url);
        return await requisicaoDetalhes.json();
    });

    pokemonsList = await Promise.all(listaDePromessas);

    renderPokemons(pokemonsList);
}

getPokemons();