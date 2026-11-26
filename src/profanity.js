import filter from 'leo-profanity'

// Встроенные словари библиотеки: английский (по умолчанию) и русский
filter.loadDictionary('en')
filter.add(filter.getDictionary('ru'))

// Слово — подряд идущие буквы и цифры любого алфавита. Сама библиотека делит текст только по пробелам,
// и «boobs!» или «слово,» с примыкающей пунктуацией проскочили бы фильтр
const word = /[\p{L}\p{N}]+/gu

// Нецензурное слово заменяется звёздочками той же длины: «boobs» → «*****».
// Проверяем слова целиком, поэтому «class» не пострадает из-за «ass» внутри
const censor = text => text.replace(word, w => (filter.check(w) ? '*'.repeat(w.length) : w))

export default censor
