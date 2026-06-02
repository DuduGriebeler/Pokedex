const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortOrder = document.getElementById("sortOrder");
const spinner = document.getElementById("spinner");

let pokemonsList = [];

function showspinner(){
    spinner.classList.remove("d-done");
}

function hidespinner(){
    spinner.classList.add("d-done");
}


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

    const urlImagem = pokemonEncontrado.sprites?.other['official-artwork']?.front_default || pokemonEncontrado.sprites?.front_default;
    document.getElementById("modalImagem").src = urlImagem;

    const listaDeTipos = pokemonEncontrado.types.map(objetoTipo => objetoTipo.type.name).join(', ');
    const listaDeHabilidades = pokemonEncontrado.abilities ? pokemonEncontrado.abilities.map(a => a.ability.name).join(', ') : 'Nenhum';

    const hp = pokemonEncontrado.stats.find(stats => stats.stat.name === 'hp')?.base_stat || 0;
    const attack = pokemonEncontrado.stats.find(stats => stats.stat.name === 'attack')?.base_stat || 0;
    const defense = pokemonEncontrado.stats.find(stats => stats.stat.name === 'defense')?.base_stat || 0;
    const specialAttack = pokemonEncontrado.stats.find(stats => stats.stat.name === 'special-attack')?.base_stat || 0;
    const specialDefense = pokemonEncontrado.stats.find(stats => stats.stat.name === 'special-defense')?.base_stat || 0;
    const speed = pokemonEncontrado.stats.find(stats => stats.stat.name === 'speed')?.base_stat || 0;

    document.getElementById("modalName").innerText = pokemonEncontrado.name.toUpperCase();
    document.getElementById("modalHeight").innerText = `Altura: ${pokemonEncontrado.height / 10} m`;
    document.getElementById("modalWeight").innerText = `Peso: ${pokemonEncontrado.weight / 10} kg`;
    document.getElementById("modalTypes").innerText = `Tipo: ${listaDeTipos}`;
    document.getElementById("modalAbility").innerText = `Habilidade: ${listaDeHabilidades}`;
    document.getElementById("modalHp").innerText = `HP: ${hp}`;
    document.getElementById("modalAttack").innerText = `Ataque: ${attack}`;
    document.getElementById("modalDefense").innerText = `Defesa: ${defense}`;
    document.getElementById("modalSpecialAttack").innerText = `Ataque Especial: ${specialAttack}`;
    document.getElementById("modalSpecialDefense").innerText = `Defesa Especial: ${specialDefense}`;
    document.getElementById("modalSpeed").innerText = `Velocidade: ${speed}`;

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

    showspinner();

    const requisicaoInicial = await fetch("https://pokeapi.co/api/v2/pokemon?limit=250");
    const respostaInicial = await requisicaoInicial.json();

    const listaDePromessas = respostaInicial.results.map(async (pokemonGenerico) => {
        const requisicaoDetalhes = await fetch(pokemonGenerico.url);
        return await requisicaoDetalhes.json();
    });

    pokemonsList = await Promise.all(listaDePromessas);

    renderPokemons(pokemonsList);

    hidespinner();
}

getPokemons();