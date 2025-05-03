import { EDITOR_FEATURE_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants"
import editorData from '../fixtures/data.json'

describe("Test editor multiblock works", () => {
    beforeEach(() => {
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
    })

    for (let i = 0; i < EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i]

        context(`Test version ${version}`, () => {

            it("Expect error when not passing tune name", () => {
                cy.interceptConsoleErrors()
                cy.loadEditorJsVersion(version, editorData, {
                    multiblock: true
                });
                cy.waitForEditorToLoad();

                cy.getConsoleErrors()
                    .should("be.calledWith", "IndentTune config 'tuneName' was not provided, this is required for multiblock option to work.")
                    .should("have.callCount", editorData.blocks.length);

            })

            it("Test simple multiblock indent", () => {
                const startIndex = 0;
                const endIndex = 2;
                const indentAmount = 3
                cy.interceptConsoleErrors()

                cy.loadEditorJsVersion(version, editorData, {
                    multiblock: true,
                    tuneName: "indentTune"
                });
                cy.waitForEditorToLoad();

                cy.applyEditorSelection(startIndex, endIndex, version)

                cy.indentUsingKeybord("indent", indentAmount)
                for (let i = startIndex; i <= endIndex; i++) {

                    cy.getBlockWrapperByIndex(i).getIndentLevel().then(level => {
                        cy.log(`Verify level on block ${i}`).wrap(level).should("equal", indentAmount)
                    })
                }

                cy.assertNoConsoleErrors()
            })

            it("Test complex multiblock indent", () => {
                const firstIndentAmount = 4;
                const secondIndentAmount = 7
                const thirdIndentAmount = 3
                cy.interceptConsoleErrors()

                cy.loadEditorJsVersion(version, editorData, {
                    multiblock: true,
                    tuneName: "indentTune",
                    maxIndent: 20,
                });
                cy.waitForEditorToLoad();

                cy.applyEditorSelection(1, 2, version)
                cy.indentUsingKeybord("indent", firstIndentAmount)
                cy.getBlockWrapperByIndex(1).click()

                cy.applyEditorSelection(0, 3, version)
                cy.indentUsingKeybord("indent", secondIndentAmount)
                cy.getBlockWrapperByIndex(3).click()


                // yes, because the selection is not done as wanted..
                cy.get("body").click()
                cy.applyEditorSelection(0, 1, version)
                cy.indentUsingKeybord("unindent", thirdIndentAmount)
                cy.getBlockWrapperByIndex(0).click()


                cy.getBlockWrapperByIndex(0).getIndentLevel().then(level => {
                    cy.log(`Verify level on block ${i}`)
                        .wrap(level)
                        .should("equal", secondIndentAmount - thirdIndentAmount)
                })
                cy.getBlockWrapperByIndex(1).getIndentLevel().then(level => {
                    cy.log(`Verify level on block ${i}`)
                        .wrap(level)
                        .should("equal", secondIndentAmount + firstIndentAmount - thirdIndentAmount)
                })
                cy.getBlockWrapperByIndex(2).getIndentLevel().then(level => {
                    cy.log(`Verify level on block ${i}`)
                        .wrap(level)
                        .should("equal", secondIndentAmount + firstIndentAmount)
                })
                cy.getBlockWrapperByIndex(3).getIndentLevel().then(level => {
                    cy.log(`Verify level on block ${i}`)
                        .wrap(level)
                        .should("equal", secondIndentAmount)
                })

                cy.assertNoConsoleErrors()
            })
        })
    }




})