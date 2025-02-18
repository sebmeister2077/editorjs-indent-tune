import { EDITOR_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants"
import editorData from '../fixtures/data.json'






// size, min max
describe("Test editor default params", () => {

    before(() => {
        cy.window().then((win) => {
            cy.spy(win.console, 'error').as('consoleError');
        });
    })

    beforeEach(() => {
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
    })

    for (let i = 0; i < 1; i++) {
        const version = EDITOR_VERSIONS[i];


        context(`Verify version ${version}`, () => {
            beforeEach(() => {
                cy.loadEditorJsVersion(version, editorData);
                cy.waitForEditorToLoad();
            })

            it("The editor loads correctly without errors", () => {
                cy.get('@consoleError').should('not.have.been.called');
            })

            it("The editor displays the data correctly", () => {
                editorData.blocks.forEach((block, index) => {
                    cy.getBlockByIndex(index).then($block => {
                        console.log("🚀 ~ cy.getBlockByIndex ~ $block:", $block)
                        const $paragraphEl = $block.children(".cdx-block");
                        const innerHtml = $paragraphEl.html()

                        expect(innerHtml).to.eq(block.data.text)
                    })
                })
            })

        })
    }
})