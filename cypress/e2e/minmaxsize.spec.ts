import { EDITOR_FEATURE_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants";
import editorData from '../fixtures/data.json'

describe("Test editor min, max nd size config works", () => {
    beforeEach(() => {
        cy.visit(TEMP_ENVIRONMENT_URL)
        cy.applyBiggerGlobalFontSize();
        cy.interceptConsoleErrors();
    })

    afterEach(() => {
        cy.assertNoConsoleErrors()
    })

    for (let i = 7; i < EDITOR_FEATURE_VERSIONS.length; i++) {
        const version = EDITOR_FEATURE_VERSIONS[i]


        context(`Test version ${version}`, () => {
            
            it("Verify min indent", () => {
                cy.loadEditorJsVersion(version, editorData)
            })
            it("Verify max indent", () => {
                
            })
            it("Verify size indent", () => {
                
            })


        })
    }
})