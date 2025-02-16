import { EDITOR_VERSIONS, TEMP_ENVIRONMENT_URL } from "../support/constants"
import editorData from '../fixtures/data.json'






// size, min max
describe("Test editor basic params", () => {

    beforeEach(() => {
        cy.visit(TEMP_ENVIRONMENT_URL, {
            onBeforeLoad(win) {
                win.localStorage.setItem('editorjs-data-testing', JSON.stringify(editorData))
            },
        })

        cy.applyBiggerGlobalFontSize();

    })

    for (let i = 0; i < EDITOR_VERSIONS.length; i++) {
        const version = EDITOR_VERSIONS[i];


        context(`Verify version ${version}`, () => {


            it("It works", () => {

            })

        })
    }
})