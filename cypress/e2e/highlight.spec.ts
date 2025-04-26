import { EDITOR_FEATURE_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants";
import editorData from '../fixtures/dataWithIndents.json';

describe("Test indent highlights", () => {
    before(() => {
        cy.window().then((win) => {
            cy.spy(win.console, 'error').as('consoleError');
        });
    })

    beforeEach(() => {
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
    })

    for (let i = 0; i < 1 || EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i];


        context(`Verify version ${version}`, () => {


            it("No Highlight", () => {
                cy.loadEditorJsVersion(version, editorData, {
                    highlightIndent: {}
                });
                cy.waitForEditorToLoad();
            })
            it("Give default highlight version", () => {
                cy.loadEditorJsVersion(version, editorData, {
                    highlightIndent: true
                });
                cy.waitForEditorToLoad();
                editorData.blocks.forEach((block, idx) => {

                    cy.getBlockByIndex(idx).getHighlightIndent().then($el => {
                        const bckgroundColor = $el.css("background-color")
                        console.log("🚀 ~ cy.getBlockByIndex ~ bckgroundColor:", bckgroundColor)
                    })
                })
            })
        })
    }
})