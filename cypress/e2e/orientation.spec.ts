import { TEMP_ENVIRONMENT_URL, EDITOR_FEATURE_VERSIONS } from "../support/constants";
import editorData from '../fixtures/data.json'

describe("Test editor orientation", () => {

    beforeEach(() => {
        cy.interceptConsoleErrors()
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
    })

    afterEach(() => {
        cy.assertNoConsoleErrors()
    })

    const maxVersionWithVerticalOption = "2.27"
    for (let i = 0; i < EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i];

        function getHorizontalElements() {
            let parent: Cypress.Chainable<JQuery<HTMLElement>>
            if (version >= "2.30") {
                parent = cy.get(".ce-popover-item-html")
            }
            else if (version <= "2.25")
                parent = cy.get(".ce-settings__plugin-zone")
            else
                parent = cy.get('.ce-popover__custom-content')
            return parent.children(".ce-popover-indent-item")

        }

        function getVerticalElements() {
            return cy.get(".ce-popover__items [data-item-name^='tune-indent-']")
        }

        context(`Verify version ${version}`, () => {

            it("Default orientation", () => {
                cy.loadEditorJsVersion(version, editorData, {

                });
                cy.waitForEditorToLoad();

                cy.openToolbarForBlockIndex(0);

                getHorizontalElements().should("exist").should("be.visible")
                getVerticalElements().should("not.exist")
            })


            it("Use horizontal config", () => {
                cy.loadEditorJsVersion(version, editorData, {
                    orientation: "horizontal"
                });
                cy.waitForEditorToLoad();

                cy.openToolbarForBlockIndex(0);

                getHorizontalElements().should("exist").should("be.visible")
                getVerticalElements().should("not.exist")
            })

            if (version < maxVersionWithVerticalOption) {

                it("Verify a warning is logged when using vertical option for older versions", () => {
                    cy.interceptConsoleWarnings();
                    cy.loadEditorJsVersion(version, editorData, {
                        orientation: "vertical"
                    });
                    cy.waitForEditorToLoad();

                    cy.openToolbarForBlockIndex(0)
                    cy.getConsoleWarnings().should("be.calledOnceWith", "Current editor version does not support vertical indent tune 'orientation'. View your config input")

                    getHorizontalElements().should("exist").should("be.visible")
                    getVerticalElements().should("not.exist")
                })
            }
            else {

                it("Use vertical config", () => {
                    cy.loadEditorJsVersion(version, editorData, {
                        orientation: "vertical"
                    });
                    cy.waitForEditorToLoad();

                    cy.openToolbarForBlockIndex(0);

                    getHorizontalElements()
                        .should("not.exist")
                    getVerticalElements()
                        .should("exist").should("be.visible").should("have.length", 2)

                })
            }


        })
    }
})