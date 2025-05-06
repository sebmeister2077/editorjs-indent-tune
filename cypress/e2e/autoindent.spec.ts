import { EDITOR_CLASSES, EDITOR_FEATURE_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants";
import editorData from '../fixtures/dataWithIndents.json'
describe("Test editor auto indent", () => {

    beforeEach(() => {
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
        cy.interceptConsoleErrors()
    })

    afterEach(() => {
        cy.assertNoConsoleErrors()
    })
    for (let i = 0; i < 1 && 1 < EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i]

        context(`Test version ${version}`, () => {

            it("Test default config without autoindent", () => {
                cy.loadEditorJsVersion(version, editorData, {
                })
                cy.waitForEditorToLoad()
                const firstBlockIndexWithIndent = editorData.blocks.findIndex(b => b.data.level > 0);

                executeTestCase()

                cy.reload()
                cy.loadEditorJsVersion(version, editorData, {
                    autoIndent: false
                })
                cy.waitForEditorToLoad()

                executeTestCase()

                function executeTestCase() {
                    cy.getBlockByIndex(firstBlockIndexWithIndent).find("[contenteditable]")
                        .click()
                        .type("{enter}")

                    cy.getBlockWrapperByIndex(firstBlockIndexWithIndent + 1).getIndentLevel().then(level => {
                        cy.wrap(level).should("equal", 0)
                    })
                    cy.get(`.${EDITOR_CLASSES.BaseBlock}`).should("have.length", editorData.blocks.length + 1)
                }
            })


            it("I expect to autoindent all blocks", () => {
                cy.loadEditorJsVersion(version, editorData, {
                    autoIndent: true
                })
                cy.waitForEditorToLoad()
                const firstBlockIndexWithIndent = editorData.blocks.findIndex(b => b.data.level > 0);
                cy.getBlockByIndex(firstBlockIndexWithIndent).find("[contenteditable]")
                    .click()
                    .type("{enter}")

                cy.getBlockWrapperByIndex(firstBlockIndexWithIndent + 1).getIndentLevel().then(level => {
                    const expectedIndent = editorData.blocks[firstBlockIndexWithIndent].data.level
                    cy.wrap(level).should("equal", expectedIndent)
                })
                cy.get(`.${EDITOR_CLASSES.BaseBlock}`).should("have.length", editorData.blocks.length + 1)
            })
        })
    }
})