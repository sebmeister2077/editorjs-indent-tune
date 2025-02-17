

// Cypress.Commands.add()
Cypress.Commands.add('applyBiggerGlobalFontSize', () => {
    cy.get("head").then(head => {
        head[0].insertAdjacentHTML("beforeend", /*html*/`<style>*{
                font-size:1.5rem !important;
            }</style>`)
    })
})

Cypress.Commands.add("loadEditorJsVersion", (version: string, data: any) => {
    cy.window().then(win => {
        return new Cypress.Promise(res => {
            win.editorVersion = version;
            const script = document.createElement("script");
            script.onload = () => {
                res();
                win.dispatchEvent(new CustomEvent("loadded-editorjs-script", {
                    detail: {
                        data
                    }
                }))
            }
            script.src = `https://cdn.jsdelivr.net/npm/@editorjs/editorjs@${version}`
            win.document.head.append(script)
        })
    })
})

Cypress.Commands.add("waitForEditorToLoad", () => {
    cy.window().then(win => {
        return new Cypress.Promise((resolve, rej) => {
            win.isEditorReady.then(resolve).catch(rej)
        })
    })
})

declare global {
    namespace Cypress {
        interface Chainable {
            // applyEditorSelection(startIndex: number, endIndex: number, version: EditorVersions[keyof EditorVersions]): Cypress.Chainable<void>
            // applyUnderline(): Cypress.Chainable<void>
            applyBiggerGlobalFontSize(): Cypress.Chainable<void>
            loadEditorJsVersion(version: string, data: any): Cypress.Chainable<void>;
            waitForEditorToLoad(): Cypress.Chainable<void>;
        }
    }
    interface Window {
        editorVersion: string;
        isEditorReady: Promise<void>;

    }
}


export { }