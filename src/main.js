import "./css/index.css"

import "./css/index.css"
import IMask from "imask"

const bgcolor = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const bgcolor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const bandeira = document.querySelector(".cc-logo span:nth-child(2) img")
// recebe o ano atual em formato numerico
// o slide detem os doi ultimos caracteres

const dataAtual = String(new Date().getFullYear()).slice(2)
const dataMaxima = String(new Date().getFullYear() + 10).slice(2)
// converter

function selectColor(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#C69347", "#DF6F29"],
    maestro: ["#CC2131", "#3A9BD9"],
    default: ["black", "gray"],
  }

  bgcolor.setAttribute("fill", colors[type][0])
  bgcolor02.setAttribute("fill", colors[type][1])
  bandeira.setAttribute("src", `cc-${type}.svg`)
}

selectColor("default")

// MASCARA DO INPUT CVC

const element = document.querySelector("#security-code")

const mask = {
  mask: "0000",
}

const securityCodeMask = IMask(element, mask)

// FIM MASCARA DO INPUT CVC

// ************************************************************

// MASCARA DO INPUT EXPIRAÇÃO CARTÃO
const expcodeDate = document.querySelector("#expiration-date")
const expDate = {
  mask: "MM{/}YY",

  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: dataAtual,
      to: dataMaxima,
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}

const expDateMasked = IMask(expcodeDate, expDate)

// *FIM EXPIRAÇÃO CARTÃO

// ************************************************************

// MASCARA NUMERO DO CARTÃO
const cardNumber = document.querySelector("#card-number")

const dispatchCardNumber = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^5\d[1-5]\d{0,2}|^22\d[2-9]\d|^2\d[3-7]\d{0,2}\d{0,12}/,
      cardtype: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
      cardtype: "maestro",
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}

const cardNumberMask = IMask(cardNumber, dispatchCardNumber)

// FIM MASCARA NÚMERO CARTÃO

// EVENTO NO FORM PARA EVITAR RECARREGAMENTO DA PAGINA
document.querySelector("form").addEventListener("submit", (even) => {
  even.preventDefault()
})

// END FORM EVENTO

// entrada imput
const cardHolder = document.querySelector("#card-holder")

// ira receber o input nome
const ccHolder = document.querySelector(".cc-holder .value")

// criamos um ouvinte para observar e realizar uma ação enquanto o evento input acontece no campus #card-holder
cardHolder.addEventListener("input", () => {
  let nome = ""
  nome += cardHolder.value
  // aqui sera passado ao nosso documento apartir de uma operação ternaria
  ccHolder.innerText = nome.length === 0 ? "FULANO DA SILVA" : nome
})

// EVENTO INPUT E ESPELHAMENTO CVC

// confere se esta tendo o evento input onde altera a mascara do cvc
securityCodeMask.on("accept", () => {
  updateSecuriteCode(securityCodeMask.value)
})

function updateSecuriteCode(codigo) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = codigo.length === 0 ? "000" : codigo
}
// FINAL INPUT E ESPELHAMENTO CVC

// MASCARA INPUT
expDateMasked.on("accept", () => {
  updateExpiration(expDateMasked.value)
})

function updateExpiration(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "MM/YY" : date
}

cardNumberMask.on("accept", () => {
  /// masked: obtem a mascara
  /// currentMask: obetem a mascara atual que se encaixou durante a entrada de dados
  // cardtype é o atributo daquele objeto

  const tipocartao = cardNumberMask.masked.currentMask.cardtype
  selectColor(tipocartao)

  updateNumCard(cardNumberMask.value)
})

function updateNumCard(numbercard) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText =
    numbercard.length === 0 ? "1234 5678 9012 3456" : numbercard
}
