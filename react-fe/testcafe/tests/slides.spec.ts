import { hostUrl } from '../environment'

import { apiLogger, hasApiErrors } from '../utils/api-interceptor.js'
import { Selector, ClientFunction } from 'testcafe'

fixture`Basic Slides`
  .page(hostUrl)
  .requestHooks(apiLogger)

test('Should proceed back & forth through slides', async (t: TestController) => {
  const printed = []

  await t
    .expect(Selector('h1').exists).ok()
    .expect(Selector('h1').innerText).eql('Moving away from Selenium')
    .pressKey('right')
    .expect(Selector('h1').exists).ok()
    .expect(Selector('h1').innerText).eql('What this covers')
    .pressKey('left')
    .expect(Selector('h1').exists).ok()
    .expect(Selector('h1').innerText).eql('Moving away from Selenium')

  await t.expect(hasApiErrors(printed)).notOk('Expected no api errors at any point')

})

test('Should proceed through the correct order', async (t: TestController) => {

  const browser = await ClientFunction(() => window['testcafe'])()

  const slideTitles = [
    'Moving away from Selenium',
    'What this covers',
    'Selenium is flakey',
    'False Positives',
    'Selenium Architecture',
    'Testing Outcomes',
    'Alternatives',
    'Benefits over Selenium',
    'Pros & Cons for Cypress',
    'Pros & Cons for TestCafe',
    'What We Chose',
    'Demos',
  ]

  slideTitles.forEach(async (title, index) => {
    await t
      .expect(Selector('h1').innerText).eql(title)
      .takeScreenshot(`${browser.name}-${browser.os}/${index}-${title}.png`)
      .pressKey('right')
  })

  await t.expect(hasApiErrors()).notOk('Expected no api errors at any point')

})