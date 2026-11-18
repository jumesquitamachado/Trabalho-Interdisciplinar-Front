// Recupera os produtos salvos
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Adicionar produtos
document.addEventListener("click", function(event) {

    if (event.target.classList.contains("btn-comprar")) {

        let nome = event.target.dataset.nome;
        let preco = Number(event.target.dataset.preco);

        let produto = carrinho.find(item => item.nome === nome);

        if (produto) {
            produto.quantidade++;
        } else {
            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: 1
            });
        }

        salvarCarrinho();

        alert("Produto adicionado ao carrinho!");
    }

});

// Salvar no navegador
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarCarrinho();
}

// Exibir produtos
function mostrarCarrinho() {

    let lista = document.getElementById("lista-carrinho");

    if (!lista) return;

    lista.innerHTML = "";

    let subtotal = 0;

    carrinho.forEach((produto, index) => {

        let valor = produto.preco * produto.quantidade;

        subtotal += valor;

        lista.innerHTML += `
            <div class="item-carrinho">

                <h3>${produto.nome}</h3>

                <p>R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>

                <button onclick="alterarQuantidade(${index}, -1)">-</button>

                <span>${produto.quantidade}</span>

                <button onclick="alterarQuantidade(${index}, 1)">+</button>

                <p>Subtotal: R$ ${valor.toFixed(2).replace(".", ",")}</p>

                <button onclick="removerProduto(${index})">
                    Remover
                </button>

            </div>
        `;
    });

    document.getElementById("subtotal").innerText =
        subtotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    document.getElementById("total").innerText =
        subtotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}

// Aumentar ou diminuir quantidade
function alterarQuantidade(index, valor) {

    carrinho[index].quantidade += valor;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    salvarCarrinho();
}

// Remover produto
function removerProduto(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();
}

// Finalizar compra (simulação)
document.addEventListener("DOMContentLoaded", function() {

    mostrarCarrinho();

    let finalizar = document.getElementById("finalizar-compra");

    if (finalizar) {
        finalizar.addEventListener("click", function() {

            if (carrinho.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            alert("Pedido realizado com sucesso!");

            carrinho = [];
            salvarCarrinho();
        });
    }

});