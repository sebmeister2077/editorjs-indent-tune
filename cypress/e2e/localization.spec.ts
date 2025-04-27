import { TEMP_ENVIRONMENT_URL } from "../support/constants";
import editorData from '../fixtures/data.json'

describe("Test editor localization", () => {

    const version = "2.30"
    beforeEach(() => {
        cy.interceptConsoleErrors()
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
    })

    afterEach(() => {
        cy.assertNoConsoleErrors()
    })


    it("I want to verify 'Indent' is translated", () => {
        const expectedLocalizedText = "Einrücken"
        cy.loadEditorJsVersion(version, editorData, {},
            {
                i18n: {
                    messages: {
                        blockTunes: {
                            indentTune: {
                                Indent: expectedLocalizedText,
                            },
                        },
                    },
                },
            });
        cy.waitForEditorToLoad();

        cy.openToolbarForBlockIndex(0);

        cy.get("[data-item-name='indent'] .ce-popover-item__title")
            .should("have.text", expectedLocalizedText)

    })


    it("I want to verify 'Un Indent' is translated", () => {
        const expectedUnIndent = 'Annulla rientro'
        const expectedIndent = 'Odsazení'
        cy.loadEditorJsVersion(version, editorData, {
            orientation: "vertical"
        },
            {
                i18n: {
                    messages: {
                        blockTunes: {
                            indentTune: {
                                Indent: expectedIndent,
                                "Un Indent": expectedUnIndent,
                            },
                        },
                    },
                },
            });
        cy.waitForEditorToLoad();
        cy.openToolbarForBlockIndex(0);

        cy.get("[data-item-name^='tune-indent-right'] .ce-popover-item__title")
            .should("have.text", expectedIndent)
        cy.get("[data-item-name^='tune-indent-left'] .ce-popover-item__title")
            .should("have.text", expectedUnIndent)
    })

})