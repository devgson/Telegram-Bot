// parser.js

function mainEntriesToHtml(entries) {
  return entries.map(entry => {
    let subDefinitionsHtml;
    const mainDefinitionHtml = `« ${entry.mainDefinitions}`
    if (entry.subDefinitions) {
      subDefinitionsHtml = entry.subDefinitions.map(subDefinition => {
        return `
        » ${subDefinition}`
      }).join('')
    }
    if (!subDefinitionsHtml) {
      return `
      <b>DEFINITION</b>:
        ${mainDefinitionHtml}
        `
    } else {
      return `
      <b>DEFINITION</b>:
        ${mainDefinitionHtml}
          <strong>SUB-DEFINITION</strong>: ${subDefinitionsHtml}
          `
    }
  })
}

function parser(json) {
  let definitionCount = 0;
  const parseEntries = json.results[0].lexicalEntries.flatMap(lexicalEntry => {
    const constructObject = { lexicalCategory: lexicalEntry.lexicalCategory.text }
    constructObject.entries = lexicalEntry.entries.map(entry => {
      return entry.senses.map(sense => {
        definitionCount++
        const definitions = { mainDefinitions: sense.definitions }
        if (sense.subsenses && Array.isArray(sense.subsenses)) {
          definitions.subDefinitions = sense.subsenses.map(subsense => subsense.definitions).flat()
        }
        return definitions
      }).flat()
    }).flat()
    return constructObject
  })

  const parsedHtml = parseEntries.map(entry => {
    return `
    <i>CATEGORY: ${entry.lexicalCategory}</i>
    ${mainEntriesToHtml(entry.entries).join('')}`
  }).join('');

  return `
  Word: <b>${json.word}</b>
  <b>${definitionCount}</b> definition(s) found for the word: <b>${json.word}</b>

  ${parsedHtml}`
}

module.exports = parser