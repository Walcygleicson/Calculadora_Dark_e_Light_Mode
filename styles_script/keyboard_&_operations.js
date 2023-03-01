
// Dicionário dos elementos usados
const elements = {
    body: document.getElementsByTagName('body')[0],
    display: document.querySelector('.display'),
    displayInputs: document.querySelector('.calculo'),
    displayResults: document.querySelector('.result'),
    numbKeys: document.querySelector('.numb-keys'),
    setKeys: document.querySelector('.set-keys'),
    opKeys: document.querySelector('.operator-keys'),
    toggleButton: document.querySelector('.toggle-button')
}


const symbolsKey = {
    Symb_setKeys: ['C','upResult', '&pi;'],
    Symb_opKeys: ['÷', '&times;', '-', '+','=']
}


// Criando uma tecla e atribuindo uma classe
const buttons = document.createElement('div')
buttons.setAttribute('class', 'calc-buttons')


// Espalhando clones da tecla criada acima nas divs ''set-keys' e 'operation-keys'
symbolsKey['Symb_setKeys'].forEach((item)=>{
    if(item == 'upResult') {
        buttons.innerHTML = '<span class="material-symbols-rounded">first_page</span>'
        elements['setKeys'].appendChild(buttons.cloneNode(true))
    } else {
        buttons.innerHTML = item
        elements['setKeys'].appendChild(buttons.cloneNode(true))
    }
})

symbolsKey['Symb_opKeys'].forEach((item)=>{
    buttons.classList.add('operation')
    buttons.innerHTML = item
    elements['opKeys'].appendChild(buttons.cloneNode(true))
})
// Removendo a classe 'operation' da tecla de igual, pois nela não será útil.
elements['opKeys'].lastElementChild.classList.remove('operation')


//Espalhando as teclas numéricas, ponto e backspace na div 'numb-keys'
for(let i = 1; i <=12; i++) {
    buttons.textContent = i
    buttons.classList.add('numeric')
    buttons.classList.remove('operation')
    
    switch(i) {
        case 10:
            buttons.innerText = '.'
            break
        case 11:
            buttons.innerText = 0
            break
        case 12:
            buttons.innerHTML = '<span class="material-symbols-rounded">backspace<span>'
            buttons.classList.remove('numeric')
            buttons.classList.add('backspace')
            break
    }
    elements['numbKeys'].appendChild(buttons.cloneNode(true))
}

//Config e animação do botão de Dark & Light Mode
let toggleState = false
elements['toggleButton'].addEventListener('click', ()=> {
    elements['body'].classList.toggle('Dark-Mode')
    elements['body'].classList.toggle('Light-Mode')
    // Posição do botão ao ser clicado e troca do ícone
    if(toggleState) {
        elements['toggleButton'].style.marginLeft = '0'
        elements['toggleButton'].lastElementChild.innerText = 'dark_mode'
        toggleState = !toggleState
    } else {
        elements['toggleButton'].style.marginLeft = 'auto'
        elements['toggleButton'].lastElementChild.innerText = 'light_mode'
        toggleState = !toggleState
    }
})

//
//
// Tratando os valores (números e simbolos) digitados
// 
const displayWidth = elements['display'].clientWidth // Largura inicial do display (este valor não muda, será sempre o valor da largura inicial do elemento display). Será usado mais a frente para validar a quantidade máxima de caracteres inseridos.
const numericButtons = document.querySelectorAll('.numeric')
const operationButtons = document.querySelectorAll('.operation')
const backspaceButton = document.querySelector('.backspace')

// Função que irá ajudar a validar algumas condições
// Recebe como argumento do parametro 'NaN', 'isDot', 'isPi'
function lastCharNaN(type){
    const str = elements['displayInputs'].textContent
    const lastChar = str.substring(str.length-1)
    if(type == 'NaN') { // Verifica se a última ocorrencia do display não é um número.
        if(isNaN(lastChar) || lastChar == ' ') {
            return true
        } else {
            return false
        }
    } else if(type == 'isDot') { // Verifica se a última ocorrencia do display é um ponto.
        if(lastChar == '.') {
            return true
        } else {
            return false
        } 
    } else if(type == 'isPi') { // Verifica se a última ocorrencia do display é um simbolo pi
        if(lastChar == 'π') {
            return true
        } else {
            return false
        }
    }
}



// Função retorna os valores digitados no displey e/ou seu tamanho.
function displayInputText(type) {
    switch(type) {
        case 'values':
            return elements['displayInputs'].innerHTML
        case 'length':
            return elements['displayInputs'].textContent.length
    }
}



// Evento de click nas teclas numéricas e tecla de ponto'
numericButtons.forEach((buttonElem)=>{
    buttonElem.addEventListener('click', (event)=>{
        let keyValue = event.target.textContent
        
        // Exclui o valor inicial zero se uma tecla numérica for pressionada, exeto as teclas zero e ponto.
        if(displayInputText('length') == 1 && displayInputText('values') == 0 && keyValue != 0 && keyValue != '.'){
            elements['displayInputs'].textContent = ''
        }
        // Adiciona o valor ao display se for uma tecla numérica ou so adiciona o ponto se já não houver outro ponto e se o valor anterior não for um sinal ou símbolo.
        if(!isNaN(keyValue) && !lastCharNaN('isPi') || keyValue == '.' && !lastCharNaN('isDot') && !lastCharNaN('NaN')){
            elements['displayInputs'].textContent += keyValue
        }
            
        /* Obs - O display terá um limite de caracteres que poderão se inseridos. Como em testes vi que se houver apenas números o display consegue caber uma quantidade diferente  de quando houver simbolos e espaços junto, resolvi regular a quantidade através da largura do display.*/
        // Se a largura atual do display ultrapassar a largura padrão inicial o último caractere (numérico) da string é excluído.
        if(elements['display'].clientWidth > displayWidth){
            elements['displayInputs'].textContent = displayInputText('values').substring(0,displayInputText('length') - 1)
        }
    })
})



//Evento de click nas teclas de opereções.
operationButtons.forEach((buttonElem)=>{
    buttonElem.addEventListener('click', (event)=>{
        let keyValue = event.target.textContent
        
            // Só adiciona o sinal de operação se a caractere anterior for numérico. Evitando que seja adicionado dois sinais simultaneos.
        if( lastCharNaN('isPi') || keyValue != 'C' && !lastCharNaN('NaN')) {
            elements['displayInputs'].textContent += ` ${keyValue} `
        }

        // Se a largura atual do display ultrapassar a largura padrão inicial o último caractere (simbolos) da string é excluído.
        if(elements['display'].clientWidth > displayWidth){
            elements['displayInputs'].textContent = displayInputText('values').substring(0,displayInputText('length') - 3) // Exclui 3 pois todo simbolo possui um espaço antes e depois
        }
       
    })
})



//Evento de deletar a última ocorrência do display (backspace).
backspaceButton.addEventListener('click', ()=>{
    let del = String()
    // Como antes e depois de um sinal existe um espaço, essa condição verifica se a ultima ocorrencia é um valor numerico e/ou ponto. Se não for, será deletada 3 casas ao final.
    if(lastCharNaN('NaN') && !lastCharNaN('isDot')){
        del = elements['displayInputs'].textContent.substring(0, elements['displayInputs'].textContent.length - 3)
    } else { // Caso contrário deleta apenas a última casa.
        del = elements['displayInputs'].textContent.substring(0, elements['displayInputs'].textContent.length - 1)
    }
    elements['displayInputs'].textContent = del
    // Se todo os valores forem deletados o display será setado para o valor inicial zero.
    if(displayInputText('length') == 0) {
        elements['displayInputs'].textContent = 0
    }
})



//Evento da tecla de limpar 'C'.
const clearButton = elements['setKeys'].firstChild
clearButton.addEventListener('click', ()=>{
    elements['displayInputs'].textContent = 0
    elements['displayResults'].textContent = 0
})


// Evento da tecla de subir resultado.
const upResult = elements['setKeys'].childNodes[1]
upResult.addEventListener('click', ()=>{
    // Só irá subir os valores do resultado caso este não seja um zero ou mensagem de erro.
    if(elements['displayResults'].textContent != 'Erro' && elements['displayResults'].textContent != 0) {
        elements['displayInputs'].textContent = elements['displayResults'].textContent
        elements['displayResults'].textContent = 0
    }
    
})


// Evento da tecla PI
const pi = elements['setKeys'].childNodes[2]
pi.addEventListener('click', (event)=>{
    // So concatena o sinal de pi se o caractere anterior no for numérico e não existir outro sinal de pi (evita que 2 pi sejam adicionados simultaneamente ao dilpay)
    if(lastCharNaN('NaN') && !lastCharNaN('isPi')) {
         elements['displayInputs'].textContent += event.target.innerHTML
         
    } else if(displayInputText('length') == 1 && displayInputText('values') == 0) {
        // Substitui o zero padrão pelo símbolo pi
        elements['displayInputs'].textContent = event.target.innerHTML
    }
    // Se a largura atual do display ultrapassar a largura padrão inicial o último caractere da string é excluído.
    if(elements['display'].clientWidth > displayWidth){
        elements['displayInputs'].textContent = displayInputText('values').substring(0,displayInputText('length') - 1)
    }
})


// Evento da tecla de resultado '=', formatação dos sinais de operaões e calculos
const equalButton = elements['opKeys'].lastElementChild
equalButton.addEventListener('click', ()=>{
    // Substituindo os simbolos de 'x' e '÷' por sinais de operações aritiméticas do JS.
    let operationFormat = displayInputText('values').replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 3.14159265359)
    try {
         elements['displayResults'].textContent = eval(operationFormat)
    } catch {
        elements['displayResults'].textContent = 'Erro'
    }
})