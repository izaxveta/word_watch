import $ from 'jquery'

$(document).ready(() => {
  displayTopWord()
  $('.text-submission textarea').on('keydown', breakDownText)
  $('.text-submission').on('click', breakDownText)
})

const breakDownText = () => {
  if (event.target.nodeName == 'BUTTON' || event.which == 13) {
    let inputValue = $('.text-submission textarea').val()
    breakDownInput(inputValue)
  }
}

const postWords = (input) => {
  input.forEach((word) => {
    fetch('https://wordwatch-api.herokuapp.com/api/v1/words', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ word: { value: word.toLowerCase() }})
    })
  })
}

const breakDownInput = (input) => {
  var wordsArray = input.split(/\s+/)
  postWords(wordsArray)
  countWords(wordsArray)
}


const countWords = (wordsArray) => {
  var wordMap = {}
  wordsArray.forEach((key) => {
    let word = key.toLowerCase()
    if (wordMap.hasOwnProperty(word)) {
      wordMap[word]++
    } else {
      wordMap[word] = 1
    }
  })
  displayWordBreakdown(wordMap)
}

const displayWordBreakdown = (wordMap) => {
  for(var index in wordMap) {
    $('.word-count').append(`<div class='word' style='font-size:${wordMap[index]}em'>${index}</div>`)
  }
}

const displayTopWord = () => {
  return fetch('https://wordwatch-api.herokuapp.com/api/v1/top_word')
    .then(response => handleResponse(response))
    .then(topWord => renderTopWord(topWord))
}

const handleResponse = (response) => {
  return response.json()
    .then(json => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusTest: response.statusText,
          json
        }
        return Promise.reject(error)
      }
      return json
    })
}


const renderTopWord = (topWord) => {
  let word = Object.keys(topWord.word)[0]
  let wordCount = Object.values(topWord.word)[0]
  $('.top-word').children('h3').append(`${word} (${wordCount})`)
}