// lista de classes e respectivas palavras possíveis
palavras_possiveis = [
    {
        classe: 'país',
        palavras: ['brasil', 'chile', 'marrocos', 'rússia', 'alemanha', 'japão', 'colômbia', 'iraque', 'méxico']
    },
    {
        classe: 'objeto',
        palavras: ['ampulheta', 'agulha', 'apito', 'lápis', 'caneca', 'bola', 'colher', 'dicionário', 'drone', 'mochila']
    },
    {
        classe: 'animal',
        palavras: ['aranha', 'abelha', 'baleia', 'boi', 'borboleta', 'cachorro', 'cavalo', 'coelho', 'gato', 'pássaro']
    },
    {
        classe: 'profissão',
        palavras: ['policial', 'bombeiro', 'professor', 'mecânico', 'médico', 'repórter', 'ator', 'designer']
    },
    {
        classe: 'fruta',
        palavras: ['maçã', 'laranja', 'uva', 'banana', 'morango', 'melancia', 'abacate', 'pêra']
    },
    {
        classe: 'cor',
        palavras: ['vermelho', 'verde', 'azul', 'amarelo', 'cinza', 'marrom', 'roxo', 'preto', 'branco']
    },
    {
        classe: 'móvel de casa',
        palavras: ['sofá', 'geladeira', 'fogão', 'microondas', 'cama', 'televisão', 'escrivaninha', 'liquidificador']
    }
]

let inicio = new Date().getTime();
let tentativasRestantes = 6;
let palavraGerada = gerarPalavraAleatoria();

mostrarParteBoneco(tentativasRestantes)
definirDica(palavraGerada.classe);
gerarCamposDaPalavra(palavraGerada.palavra)
atualizarTentativas(0)

// EventListener para obter tecla digitada e processar jogada
document.addEventListener('keypress', e => {
    let letraDigitada = formatarLetraPalavraDigitada(e.key);
    e.preventDefault();

    if(!isLetraValida(letraDigitada)) {
        alert('Digite uma letra válida!');
        return
    }

    if(isLetraJaTentada(letraDigitada)) {
        alert('Você já digitou essa letra! Tente outra!');
        return
    }
    
    mostrarLetra(letraDigitada, palavraGerada);
    adicionarLetraTentada(letraDigitada);

    // verifica se palavra contém letra digitada
    if(!formatarLetraPalavraDigitada(palavraGerada.palavra).includes(letraDigitada.toLowerCase())) {
        atualizarTentativas(1);
        mostrarParteBoneco(tentativasRestantes);
        document.querySelector('#boca').classList = 'boca_triste';
    } else {
        document.querySelector('#boca').classList = 'boca_normal';
    }

    if(tentativasRestantes === 0) {
        alert(`
            Você perdeu, a palavra era ${palavraGerada.palavra.toUpperCase()}.
        `);

        isContinuarJogando()
    }

    // verifica se o jogador completou a palavra e venceu o jogo
    if(formatarLetraPalavraDigitada(palavraGerada.palavra) === palavraFormada()) {
        let fim = new Date().getTime();
        let minutos = Math.floor(((fim - inicio)/1000) / 60);
        let segundos = ((fim - inicio)/1000) - minutos * 60;

        let tempoFormatado = minutos > 0 ? `${minutos}min${segundos.toFixed(0)}s` : `${segundos.toFixed(0)}s`;

        alert(`
            !!!WINNER WINNER CHICKEN DINNER!!!

            Você acertou a palavra ${palavraGerada.palavra.toUpperCase()} em ${tempoFormatado} com ${tentativasRestantes > 1 ? tentativasRestantes + ' tentativas' :  tentativasRestantes + ' tentativa'} restantes! 
        `);

        isContinuarJogando();
    }
});

function formatarLetraPalavraDigitada(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function gerarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function gerarPalavraAleatoria() {
    let idClasse = gerarNumeroAleatorio(0, 6);
    let idPalavra = gerarNumeroAleatorio(0, palavras_possiveis[idClasse].palavras.length - 1);

    return { 
        classe: palavras_possiveis[idClasse].classe,
        palavra: palavras_possiveis[idClasse].palavras[idPalavra]
    }
}

function palavraFormada() {
    let palavraFormada = document.querySelector('.letras').innerText.replaceAll(' ', '').toLowerCase();
    return formatarLetraPalavraDigitada(palavraFormada);
}

function letrasTentadasEmArray() {
    return document.querySelector('#infos_tentativas span').innerText.replaceAll(', ', ',').split(',') || [];
}

function definirDica(classe) {
    document.querySelector('#dica').innerText = classe;
}

function mostrarParteBoneco(tentativasRestantes) {
    let partesDisponiveis =  ['#cabeca_boneco', '#tronco_boneco', '#braco_esquerdo', '#braco_direito', '#perna_esquerda', '#perna_direita']

    // mostra partes de acordo com qtd de tentativas restantes
    partesDisponiveis.map((parte, id) => {
        if(6 - tentativasRestantes > id) {
            //formatar estilos boneco
            if(parte === '#tronco_boneco') document.querySelector('#tronco_boneco_container').style.justifyContent='center';
            if(parte === '#braco_esquerdo') document.querySelector('#tronco_boneco_container').style.justifyContent='flex-start';

            document.querySelector(parte).style.display = ''
        } else {
            document.querySelector(parte).style.display = 'none'
        }
        
    })
}

function adicionarLetraTentada(letra) {
    let letrasTentadasSpan = document.querySelector('#infos_tentativas span');

    letrasTentadasSpan.innerText.length > 0 ? letrasTentadasSpan.innerText += `, ${letra.toUpperCase()}` : letrasTentadasSpan.innerText = letra.toUpperCase();
}

function gerarCamposDaPalavra(palavra) {
    for(letra of palavra) {
        document.querySelector('.letras').innerHTML += `<u>&nbsp;&nbsp;&nbsp;</u> `
    }
}

function isLetraJaTentada(letraDigitada) {
    return letrasTentadasEmArray().includes(letraDigitada.toUpperCase()) ? true : false;
}

function isLetraValida(letraDigitada) {
    let isValida = /([A-Za-z])$/.test(letraDigitada);

    return isValida && letraDigitada !== 'Enter';
}

function atualizarTentativas(qtdParaDiminuir) {
    tentativasRestantes -= qtdParaDiminuir;
    document.querySelector('#tentativas_restantes span').innerText = tentativasRestantes;
}

function mostrarLetra(letra, palavraGerada) {
    let posicoesLetras = document.querySelectorAll('.letras u');

    posicoesLetras.forEach((posicao, id) => {
        if(formatarLetraPalavraDigitada(palavraGerada.palavra)[id] === letra) {
            posicao.innerText = palavraGerada.palavra[id].toUpperCase();
        }
    });
}

function isContinuarJogando() {
    let isContinuarJogando = confirm('Deseja jogar novamente?');

    isContinuarJogando ? window.location.reload() : window.location.href = 'https://www.google.com'
}