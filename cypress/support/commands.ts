

// Cypress.Commands.add()
Cypress.Commands.add('applyBiggerGlobalFontSize', () => {
    cy.get("head").then(head => {
        head[0].insertAdjacentHTML("beforeend", /*html*/`<style>*{
                font-size:1.5rem !important;
            }</style>`)
    })
})

declare global {
    namespace Cypress {
        interface Chainable {
            // applyEditorSelection(startIndex: number, endIndex: number, version: EditorVersions[keyof EditorVersions]): Cypress.Chainable<void>
            // applyUnderline(): Cypress.Chainable<void>
            applyBiggerGlobalFontSize(): Cypress.Chainable<void>
        }
    }
    // interface Window {
    //     isEditorReady: Promise<void>;
    //     editorVersion: string;
    // }
}


export { }