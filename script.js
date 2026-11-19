let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

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

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarCarrinho();
}

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
        <button onclick="removerProduto(${index})">Remover</button>

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

function alterarQuantidade(index, valor) {

    carrinho[index].quantidade += valor;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    salvarCarrinho();
}

function removerProduto(index) {

    carrinho.splice(index, 1);
    salvarCarrinho();
}

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

function converterPreco(valor) {
    if (typeof valor === "number") {
        return valor;
    }

    return Number(
        String(valor)
            .replace("R$", "")
            .trim()
            .replace(/\./g, "")
            .replace(",", ".")
    ) || 0;
}

function gerarArquivoJSON(pedido) {
    const dadosJSON = JSON.stringify(pedido, null, 4);

    const arquivo = new Blob(
        [dadosJSON],
        { type: "application/json" }
    );

    const link = document.createElement("a");
    const url = URL.createObjectURL(arquivo);
    link.href = url;
    link.download = `pedido_${pedido.pedido_id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", function () {

    const botaoFinalizar = document.getElementById("finalizarcompra");

    if (!botaoFinalizar) return;

    botaoFinalizar.addEventListener("click", function (event) {

        event.preventDefault();

        const carrinho = JSON.parse(
            localStorage.getItem("carrinho") || "[]"
        );

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const produtos = carrinho.map(function (produto) {

            const preco = converterPreco(produto.preco);
            const quantidade = Number(produto.quantidade);

            return {
                nome_produto: produto.nome,
                preco_unitario: preco,
                quantidade: quantidade,
                subtotal: preco * quantidade
            };
        });

        const valorTotal = produtos.reduce(function (total, produto) {
            return total + produto.subtotal;
        }, 0);

        const pedido = {

            pedido_id: Date.now(),
            data_pedido: new Date().toISOString(),
            status: "Pendente",
            cliente: null,
            itens_pedido: produtos,
            valor_total: valorTotal

        };

        gerarArquivoJSON(pedido);

        const pedidosSalvos = JSON.parse(
            localStorage.getItem("pedidos") || "[]"
        );

        pedidosSalvos.push(pedido);

        localStorage.setItem(
            "pedidos",
            JSON.stringify(pedidosSalvos)
        );

        localStorage.removeItem("carrinho");

        alert("Pedido finalizado com sucesso! JSON gerado.");

        setTimeout(function () {
            location.reload();
        }, 300);

    });

});