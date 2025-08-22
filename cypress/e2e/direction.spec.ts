// Direction ltr/rtl and direction change

import { EDITOR_FEATURE_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants";
import editorData from '../fixtures/data.json'
import { TextDirection } from "../support/types";


describe("Test indent direction", () => {

    beforeEach(() => {
        cy.interceptConsoleErrors();
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize()
    })

    afterEach(() => {
        cy.assertNoConsoleErrors()
    })


    function assertDirection(blockIndex: number, expectedIndentPx: string, dir: TextDirection) {
        cy.getBlockWrapperByIndex(blockIndex).then((el) => {
            cy.log(`Asserting for direction: ${dir}`)
            if (dir === 'ltr') {
                cy.wrap(el.css("paddingLeft")).should("equal", expectedIndentPx)
                cy.wrap(el.css("paddingRight")).should("equal", "0px")
            }
            else {
                cy.wrap(el.css("paddingRight")).should("equal", expectedIndentPx)
                cy.wrap(el.css("paddingLeft")).should("equal", "0px")
            }
        })
    }

    for (let i = 0; i < EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i]

        context(`Verify version ${version}`, () => {
            const blockIndex = 1;
            const defaultIndentSize = 24 * 2
            const indentAmount = 2;

            it("Use default config", () => {
                const expectedIndentPx = `${defaultIndentSize * indentAmount}px`
                cy.loadEditorJsVersion(version, editorData, {},
                    {
                    });
                cy.waitForEditorToLoad();

                cy.openToolbarForBlockIndex(blockIndex)
                cy.indentBlockUsingToolbar("right", indentAmount, version)

                assertDirection(blockIndex, expectedIndentPx, "ltr");
            })

            it("Use rtl config", () => {
                const direction: TextDirection = 'rtl'
                cy.loadEditorJsVersion(version, editorData, {
                    direction
                },
                    {
                    });
                cy.waitForEditorToLoad();
                const expectedIndentPx = `${defaultIndentSize * indentAmount}px`

                cy.openToolbarForBlockIndex(blockIndex)
                cy.indentBlockUsingToolbar("left", indentAmount, version)

                assertDirection(blockIndex, expectedIndentPx, direction);
            })


            it("Use ltr config", () => {
                const direction: TextDirection = 'ltr'

                cy.loadEditorJsVersion(version, editorData, {
                    direction
                },
                    {
                    });
                cy.waitForEditorToLoad();

                const expectedIndentPx = `${defaultIndentSize * indentAmount}px`

                cy.openToolbarForBlockIndex(blockIndex)
                cy.indentBlockUsingToolbar("right", indentAmount, version)

                assertDirection(blockIndex, expectedIndentPx, direction);
            })

            // version 2.20 does not support blockId
            if (version <= "2.20") return;

            it("Use direction change handler", () => {
                const blockId = editorData.blocks[blockIndex].id;
                const listeners = []
                cy.loadEditorJsVersion(version, editorData, {
                    directionChangeHandler(listener) {
                        listeners.push(listener)
                    },
                },
                    {
                    });
                cy.waitForEditorToLoad();
                const expectedIndentPx = `${defaultIndentSize * indentAmount}px`
                cy.openToolbarForBlockIndex(blockIndex)
                cy.indentBlockUsingToolbar("right", indentAmount, version)

                function toggleDirection(direction: TextDirection) {
                    for (const l of listeners) {
                        l(blockId, direction);
                    }
                    assertDirection(blockIndex, expectedIndentPx, direction);
                }

                const minimumWaitTime = 0; // just as microtask(()=>{})

                cy.wait(minimumWaitTime).then(() => {
                    cy.log("Change to ltr")
                    toggleDirection("ltr")
                })
                cy.wait(minimumWaitTime).then(() => {
                    cy.log("Change to rtl")
                    toggleDirection("rtl")
                })
                cy.wait(minimumWaitTime).then(() => {
                    cy.log("Change to ltr")
                    toggleDirection("ltr")
                })
                cy.wait(minimumWaitTime).then(() => {
                    cy.log("Change to rtl")
                    toggleDirection("rtl")
                })
                cy.wait(minimumWaitTime).then(() => {
                    cy.log("Simulate double chnge to rtl")
                    toggleDirection("rtl")
                })
                cy.wait(minimumWaitTime).then(() => {
                    cy.log("Change to ltr")
                    toggleDirection("ltr")
                })

            })
        })
    }
})