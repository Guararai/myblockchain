const crypto = require('crypto');

const criarBloco = (indice, conteudo, hashAnterior) => {
    const timestamp = Date.now();
    const hash = calcularHash(indice, timestamp, conteudo, hashAnterior);
    return { indice, timestamp, conteudo, hashAnterior, hash };
};

const calcularHash = (indice, timestamp, conteudo, hashAnterior) => {
    const dados = indice + hashAnterior + timestamp + JSON.stringify(conteudo);
    return crypto.createHash('sha256').update(dados).digest('hex');
};

const criarBlockchain = () => [criarBlocoGenesis()];

const criarBlocoGenesis = () => criarBloco(0, { usuario: "Davi_admin", mensagem: "Twitter novo" }, "0");

const obterUltimoBloco = (blockchain) => blockchain[blockchain.length - 1];

const adicionarPost = (blockchain, conteudo) => {
    const blocoAnterior = obterUltimoBloco(blockchain);
    const novoBloco = criarBloco(blocoAnterior.indice + 1, conteudo, blocoAnterior.hash);
    return [...blockchain, novoBloco];
};

const eBlockchainValida = (blockchain) => {
    return blockchain.every((bloco, indice) => {
        if (indice === 0) return true;
        const blocoAnterior = blockchain[indice - 1];
        const hashCalculado = calcularHash(bloco.indice, bloco.timestamp, bloco.conteudo, bloco.hashAnterior);
        return bloco.hashAnterior === blocoAnterior.hash && bloco.hash === hashCalculado;
    });
};

const demonstrarRedeSocial = () => {
    let blockchain = criarBlockchain();

    blockchain = adicionarPost(blockchain, { usuario: "Luciano", mensagem: "rpg muito bom" });
    blockchain = adicionarPost(blockchain, { usuario: "Cainã", mensagem: "só rock" });
    blockchain = adicionarPost(blockchain, { usuario: "Bianca", mensagem: "como que dirige?" });

    console.log(JSON.stringify(blockchain, null, 2));
    console.log("É válido?", eBlockchainValida(blockchain));
};

demonstrarRedeSocial();