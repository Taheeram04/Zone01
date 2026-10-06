import { writeFile } from 'node:fs/promises'

const input = process.argv[2] ?? ''

const veryDisco = input
  .split(' ')
  .map((word) => {
    const middle = Math.ceil(word.length / 2)
    return word.slice(middle) + word.slice(0, middle)
  })
  .join(' ')

await writeFile('verydisco-forever.txt', veryDisco)
