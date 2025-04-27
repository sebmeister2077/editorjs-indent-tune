import { EDITOR_FEATURE_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants";
import editorData from '../fixtures/dataWithIndents.json';

describe("Test indent highlights", () => {
    beforeEach(() => {
        cy.interceptConsoleErrors()
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
    })

    afterEach(() => {
        cy.assertNoConsoleErrors()
    })

    for (let i = 0; i < 1 && 1 < EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i];


        context(`Verify version ${version}`, () => {


            it("No Highlight", () => {
                cy.loadEditorJsVersion(version, editorData, {
                    highlightIndent: undefined
                });
                cy.waitForEditorToLoad();
                editorData.blocks.forEach((block, idx) => {
                    cy.getBlockByIndex(idx).getHighlightIndent().should("not.exist")
                })
            })

            it("Give default highlight version", () => {
                cy.loadEditorJsVersion(version, editorData, {
                    highlightIndent: {}
                });
                cy.waitForEditorToLoad();
                const transparentColor = 'rgba(0,0,0,0)';

                editorData.blocks.forEach((block, idx) => {

                    cy.getBlockByIndex(idx).getHighlightIndent().then($el => {
                        const backgroundColor = $el.css("background-color").trim().replace(/\s+/g, '')

                        cy.wrap(backgroundColor).should("equal", transparentColor)

                    })
                })
            })

            it("Use custom highlight class", () => {
                const customClassName = "test"
                cy.loadEditorJsVersion(version, editorData, {
                    highlightIndent: {
                        className: customClassName
                    }
                });
                cy.waitForEditorToLoad();
                editorData.blocks.forEach((block, idx) => {
                    cy.getBlockByIndex(idx).getHighlightIndent().should("have.class", customClassName)
                })
            })


            it("Only apply default highlight to some block types", () => {
                const blockType = editorData.blocks[1].type
                cy.loadEditorJsVersion(version, editorData, {
                    highlightIndent: {
                        tuneNames: [blockType]
                    }
                });
                cy.waitForEditorToLoad();
                editorData.blocks.forEach((block, idx) => {
                    const shouldHaveHighlight = block.type === blockType
                    const cyHighlight = cy.getBlockByIndex(idx).getHighlightIndent();

                    if (shouldHaveHighlight) cyHighlight
                        .should("exist");
                    else
                        cyHighlight.should("not.exist")
                })
            })

            it("Only apply custom highlight to some block types", () => {
                const blockType = editorData.blocks[1].type
                const customClassName = "test"

                cy.loadEditorJsVersion(version, editorData, {
                    highlightIndent: {
                        className: customClassName,
                        tuneNames: [blockType]
                    }
                });
                cy.waitForEditorToLoad();
                editorData.blocks.forEach((block, idx) => {
                    const shouldHaveHighlight = block.type === blockType
                    const cyHighlight = cy.getBlockByIndex(idx).getHighlightIndent();

                    if (shouldHaveHighlight) cyHighlight
                        .should("exist").should("have.class", customClassName);
                    else
                        cyHighlight.should("not.exist")
                })
            })


        })
    }
})