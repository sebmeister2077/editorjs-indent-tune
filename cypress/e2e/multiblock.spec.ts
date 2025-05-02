import { EDITOR_FEATURE_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants"
import editorData from '../fixtures/data.json'

describe("Test editor multiblock works", () => {
    beforeEach(() => {
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
    })

    for (let i = 0; i < 1 && 1 < EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i]

        context(`Test version ${version}`, () => {

            it("Expect error when not passing tune name", () => {
                cy.interceptConsoleErrors()
                cy.loadEditorJsVersion(version, editorData, {
                    multiblock: true
                });
                cy.waitForEditorToLoad();

                cy.getConsoleErrors()
                    // .should("have.been.called")
                    .should("be.calledWith", "IndentTune config 'tuneName' was not provided, this is required for multiblock option to work.")
                    .should("have.callCount", editorData.blocks.length);

            })

            it("Test multiblock indent", () => {
                cy.interceptConsoleErrors()

                cy.loadEditorJsVersion(version, editorData, {
                    multiblock: true,
                    tuneName: "indentTune"
                });
                cy.waitForEditorToLoad();





                cy.assertNoConsoleErrors()
            })
        })
    }




})