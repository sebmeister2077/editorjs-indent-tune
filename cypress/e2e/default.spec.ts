import { EDITOR_CLASSES, EDITOR_VERSIONS, TEMP_ENVIRONMENT_URL, WRAPPER_ATTRIBUTE_NAME } from "../support/constants"
import editorData from '../fixtures/dataWithIndents.json'
import { getClassSelectorForBlockType, isVersionWhereHeaderBlockIsNotWorking, isVersionWithPointerEventsNone } from "../support/helpers";
import { EditorVersions } from "../support/EditorVersions";

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
                const versionsWhereTuneWontBeAppliedToNonIndentedBlocks = ['2.20.1'];

                // if block.tune.indentLevel is non existent then it wont be applied
                const isVerionWhereTuneWontBeAppliedToNonIndentedBlocks = versionsWhereTuneWontBeAppliedToNonIndentedBlocks.includes(version)
                let expectedBlockWrappers = editorData.blocks.length
                if (isVerionWhereTuneWontBeAppliedToNonIndentedBlocks) {
                    expectedBlockWrappers = editorData.blocks.filter(b => b.tunes.indentTune).length;
                }
                cy.get(`[${WRAPPER_ATTRIBUTE_NAME}]`).should("have.length", expectedBlockWrappers)

                editorData.blocks.forEach((block) => {
                    if (isVerionWhereTuneWontBeAppliedToNonIndentedBlocks && !block.tunes.indentTune) return;
                    if (isVersionWhereHeaderBlockIsNotWorking(version) && block.type === 'header') return;
                    const index = editorData.blocks.indexOf(block)
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
                const defaultIndentSize = 24
                const expectedIndentSize = (defaultIndentSize * expectLevel * 2) + "px"

                cy.openToolbarForBlockIndex(blockIndex);

                cy.indentBlockUsingToolbar("right", indentAmount, version)


                cy.getBlockWrapperByIndex(blockIndex).then($blockWrapper => {

                    cy.wrap($blockWrapper).should("have.attr", WRAPPER_ATTRIBUTE_NAME)

                    const displayedIndentLevel = $blockWrapper.attr(WRAPPER_ATTRIBUTE_NAME)
                    expect(displayedIndentLevel).to.eq((expectLevel).toString())
                    cy.window().then(win => {
                        const { paddingLeft } = win.getComputedStyle($blockWrapper[0]);
                        expect(paddingLeft).to.eq(expectedIndentSize, 'Expect visual indentation on paragraph')
                    })

                })

            })

            it("Test out the default indent limits", () => {
                const defaultMinLimit = 0;
                const defaultMaxLimit = 8;
                const indentIntervalSize = defaultMaxLimit - defaultMinLimit
                const blockIndex = 1;

                cy.openToolbarForBlockIndex(blockIndex);
                if (isVersionWithPointerEventsNone(version))
                    cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-left]`).should("have.css", "pointer-events", 'auto')
                else
                    cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-left]`).should("have.css", "cursor", 'pointer')

                cy.indentBlockUsingToolbar("right", indentIntervalSize, version)
                if (isVersionWithPointerEventsNone(version))
                    cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-right]`).should("have.css", "pointer-events", 'none')
                else
                    cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-right]`).should("have.css", "cursor", 'default')

                cy.getBlockWrapperByIndex(blockIndex).then($blockWrapper => {
                    const displayedIndentLevel = $blockWrapper.attr(WRAPPER_ATTRIBUTE_NAME)
                    expect(displayedIndentLevel).to.eq((defaultMaxLimit).toString())
                })


                cy.indentBlockUsingToolbar("left", indentIntervalSize, version)

                if (isVersionWithPointerEventsNone(version))
                    cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-left]`).should("have.css", "pointer-events", 'none')
                else
                    cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-left]`).should("have.css", "cursor", 'default')

                cy.getBlockWrapperByIndex(blockIndex).then($blockWrapper => {
                    const displayedIndentLevel = $blockWrapper.attr(WRAPPER_ATTRIBUTE_NAME)
                    expect(displayedIndentLevel).to.eq((defaultMinLimit).toString())
                })

            })
            if (version < "2.22") return

            it("Test out saving of data", () => {
                const blockIndex = 1;
                const amonudToIndent = 2;

                cy.openToolbarForBlockIndex(blockIndex);
                cy.indentBlockUsingToolbar("right", amonudToIndent, version);

                cy.waitForEditorSaveEvent().then((res) => {
                    expect(res.data).to.have.property("blocks").that.is.an("array");
                    if (!("blocks" in res.data)) return;

                    const blocks = res.data.blocks as any[]

                    expect(blocks).have.length(editorData.blocks.length);
                    blocks.forEach((block, idx) => {
                        const previousBlockIndex = editorData.blocks[idx].tunes.indentTune?.indentLevel ?? 0;
                        if (idx == blockIndex)
                            expect(block.tunes.indentTune.indentLevel).to.eq(previousBlockIndex + amonudToIndent)
                        else
                            expect(block.tunes.indentTune.indentLevel).to.eq(previousBlockIndex)

                    })

                })

            })

        })
    }
})