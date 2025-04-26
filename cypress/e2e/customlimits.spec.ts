import { EDITOR_FEATURE_VERSIONS, EDITOR_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants";
import editorData from '../fixtures/dataWithIndents.json';

describe("Test editor custom block limits", () => {
    beforeEach(() => {
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
        cy.interceptConsoleErrors()
    })

    afterEach(() => {
        cy.assertNoConsoleErrors()
    })

    const defaultMin = 0
    const defaultMax = 8
    for (let i = 0; i < EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i];


        context(`Verify version ${version}`, () => {

            it("Give empty limits object", () => {
                const blockIndex = 1

                cy.loadEditorJsVersion(version, editorData, {
                    customBlockIndentLimits: {
                        paragraph: {

                        }
                    }
                });
                cy.waitForEditorToLoad();

                cy.openToolbarForBlockIndex(blockIndex);

                cy.indentBlockUsingToolbar("left", 10)

                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel()
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", defaultMin)

                cy.indentBlockUsingToolbar("right", 10)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", defaultMax)

            })


            it("Give empty limits object but use global min max as fallback", () => {
                const minIndent = 1;
                const maxIndent = 6;
                const blockIndex = 1

                cy.loadEditorJsVersion(version, editorData, {
                    customBlockIndentLimits: {
                    },
                    minIndent,
                    maxIndent,
                });
                cy.waitForEditorToLoad();

                cy.openToolbarForBlockIndex(blockIndex);

                cy.indentBlockUsingToolbar("left", 10)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", minIndent)

                cy.indentBlockUsingToolbar("right", 10)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", maxIndent)
            })

            it("Give only min property", () => {
                const minIndent = 2;
                const blockIndex = 1;
                const indentAmount = 13;

                const expectLevel = minIndent;

                cy.loadEditorJsVersion(version, editorData, {
                    customBlockIndentLimits: {
                        paragraph: {
                            min: minIndent
                        }
                    }
                });
                cy.waitForEditorToLoad();

                cy.openToolbarForBlockIndex(blockIndex);

                cy.indentBlockUsingToolbar("left", indentAmount)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", expectLevel)

                cy.indentBlockUsingToolbar("right", indentAmount)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", defaultMax)


            })

            it("Give only max property", () => {
                const maxIndent = 6;
                const blockIndex = 1;
                const indentAmount = 13;

                const expectLevel = maxIndent;
                cy.loadEditorJsVersion(version, editorData, {
                    customBlockIndentLimits: {
                        paragraph: {
                            max: maxIndent
                        }
                    }
                });
                cy.waitForEditorToLoad();

                cy.openToolbarForBlockIndex(blockIndex);

                cy.indentBlockUsingToolbar("right", indentAmount)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", expectLevel)

                cy.indentBlockUsingToolbar("left", indentAmount)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", defaultMin)
            })

            it("Give both properties for only paragraph", () => {
                const maxIndent = 7;
                const minIndent = 2;
                const blockIndex = 1;

                cy.loadEditorJsVersion(version, editorData, {
                    customBlockIndentLimits: {
                        paragraph: {
                            min: minIndent,
                            max: maxIndent
                        }
                    }
                });
                cy.waitForEditorToLoad();

                cy.openToolbarForBlockIndex(blockIndex);

                cy.indentBlockUsingToolbar("right", 10)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", maxIndent)

                cy.indentBlockUsingToolbar("left", 10)
                cy.getBlockWrapperByIndex(blockIndex).getIndentLevel().should("eq", minIndent)
            })



            it("I want paragraph and header to have different custom limits", () => {
                const maxHeader = 6;
                const minParagraph = 2
                cy.loadEditorJsVersion(version, editorData, {
                    customBlockIndentLimits: {
                        header: {
                            max: maxHeader
                        },
                        paragraph: {
                            min: minParagraph
                        }
                    }
                });
                cy.waitForEditorToLoad();

                const pIndex = 2;
                const hIndex = 3;

                cy.openToolbarForBlockIndex(pIndex);
                cy.indentBlockUsingToolbar("left", 10)
                cy.getBlockWrapperByIndex(pIndex).getIndentLevel().should("eq", minParagraph)

                // uhm i think i need an older header version for older editor

                if (version >= "2.26") {
                    cy.openToolbarForBlockIndex(hIndex);
                    cy.indentBlockUsingToolbar("right", 10)
                    cy.getBlockWrapperByIndex(hIndex).getIndentLevel().should("eq", maxHeader)
                }

            })



        })
    }
})