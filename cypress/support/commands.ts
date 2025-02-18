import EditorJS from '@editorjs/editorjs'

// Cypress.Commands.add()
Cypress.Commands.add('applyBiggerGlobalFontSize', () => {
    cy.get("head").then(head => {
        head[0].insertAdjacentHTML("beforeend", /*html*/`<style>*{
                font-size:1.5rem !important;
            }</style>`)
    })
})

Cypress.Commands.add("loadEditorJsVersion", (version: string, data: any, config: Object = {}) => {
    cy.window().then(win => {
        return new Cypress.Promise(res => {
            win.editorVersion = version;
            const script = document.createElement("script");
            script.onload = () => {
                win.dispatchEvent(new CustomEvent("loadded-editorjs-script", {
                    detail: {
                        data,
                        config
                    }
                }))
                setTimeout(res, 0)
            }
            script.src = `https://cdn.jsdelivr.net/npm/@editorjs/editorjs@${version}`
            win.document.head.append(script)
        })
    })
})

Cypress.Commands.add("waitForEditorToLoad", () => {
    cy.window().then(win => {
        return new Cypress.Promise((resolve, rej) => {
            win.editor.isReady.then(resolve).catch(rej)
        })
    })
})

Cypress.Commands.add("getBlockByIndex", function (index: number) {

    return cy.document().then(function (doc) {
        return doc.querySelector(`.ce-block:nth-child(${index + 1}) .ce-block__content`) as HTMLElement;
    })
})

declare global {
    namespace Cypress {
        interface Chainable {
            // applyEditorSelection(startIndex: number, endIndex: number, version: EditorVersions[keyof EditorVersions]): Cypress.Chainable<void>
            // applyUnderline(): Cypress.Chainable<void>
            applyBiggerGlobalFontSize(): Cypress.Chainable<void>
            loadEditorJsVersion(version: string, data: any, config?: Object): Cypress.Chainable<void>;
            waitForEditorToLoad(): Cypress.Chainable<void>;
            getBlockByIndex(index: number): Cypress.Chainable<JQuery<HTMLElement>>;
        }
    }
    interface Window {
        editorVersion: string;
        editor: EditorJS;

    }
}


export { }