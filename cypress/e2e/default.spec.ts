import { EDITOR_CLASSES, EDITOR_VERSIONS, TEMP_ENVIRONMENT_URL, WRAPPER_ATTRIBUTE_NAME } from "../support/constants"
import editorData from '../fixtures/dataWithIndents.json'
import { getClassSelectorForBlockType } from "../support/helpers";

describe("Test editor default functionality", () => {
    beforeEach(() => {
        cy.window().then((win) => {
            cy.spy(win.console, 'error').as('consoleError');
        });
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
    })

    for (let i = 0; i < EDITOR_VERSIONS.length; i++) {
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
                cy.get(`[${WRAPPER_ATTRIBUTE_NAME}]`).should("have.length", editorData.blocks.length,)
                editorData.blocks.forEach((block, index) => {
                    cy.getBlockByIndex(index).then($block => {
                        const $contentEl = $block.find(getClassSelectorForBlockType(block.type));
                        const innerHtml = $contentEl.html()
                        const displayedIndentLevel = $block.find(`[${WRAPPER_ATTRIBUTE_NAME}]`).attr(WRAPPER_ATTRIBUTE_NAME)

                        expect(innerHtml).to.eq(block.data.text)
                        if (block.data.level !== undefined) {
                            expect(displayedIndentLevel).to.eq(block.data.level.toString())
                        }
                    })
                })
            })


            it("The editor toolbar displays the indent option", () => {
                // Click on the 2nd block toolbar
                cy.openToolbarForBlockIndex(1);

                cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot}`).should("be.visible").should("include.text", 'Indent');
                cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot}`).children("[data-tune-indent-left]").should("be.visible")
                cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot}`).children("[data-tune-indent-right]").should("be.visible")

            })

            it("I want to be able to indent a paragraph", () => {
                const blockIndex = 1;
                const indentAmount = 3;
                const initialLevel = editorData.blocks[blockIndex].data.level ?? 0;
                const expectLevel = initialLevel + indentAmount;

                cy.openToolbarForBlockIndex(blockIndex);

                cy.indentBlockUsingToolbar("right", indentAmount)


                cy.getBlockWrapperByIndex(blockIndex).then($blockWrapper => {

                    cy.wrap($blockWrapper).should("have.attr", WRAPPER_ATTRIBUTE_NAME)

                    const displayedIndentLevel = $blockWrapper.attr(WRAPPER_ATTRIBUTE_NAME)
                    expect(displayedIndentLevel).to.eq((expectLevel).toString())
                    cy.window().then(win => {
                        const { paddingLeft } = win.getComputedStyle($blockWrapper[0]);
                        expect(paddingLeft).to.eq('144px', 'Expect visual indentation on paragraph')
                    })

                })

            })

            it("Test out the default indent limits", () => {
                const defaultMinLimit = 0;
                const defaultMaxLimit = 8;
                const indentIntervalSize = defaultMaxLimit - defaultMinLimit
                const blockIndex = 1;

                cy.openToolbarForBlockIndex(blockIndex);
                cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-left]`).should("have.css", "pointer-events", 'none')


                cy.indentBlockUsingToolbar("right", indentIntervalSize)
                cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-right]`).should("have.css", "pointer-events", 'none')

                cy.getBlockWrapperByIndex(blockIndex).then($blockWrapper => {
                    const displayedIndentLevel = $blockWrapper.attr(WRAPPER_ATTRIBUTE_NAME)
                    expect(displayedIndentLevel).to.eq((defaultMaxLimit).toString())
                })


                cy.indentBlockUsingToolbar("left", indentIntervalSize)
                cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-left]`).should("have.css", "pointer-events", 'none')

                cy.getBlockWrapperByIndex(blockIndex).then($blockWrapper => {
                    const displayedIndentLevel = $blockWrapper.attr(WRAPPER_ATTRIBUTE_NAME)
                    expect(displayedIndentLevel).to.eq((defaultMinLimit).toString())
                })

            })

            //TODO verify the editor data is saved correctly

        })
    }
})