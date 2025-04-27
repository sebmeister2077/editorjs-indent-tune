import EditorJS from '@editorjs/editorjs'
import { EDITOR_CLASSES, WRAPPER_ATTRIBUTE_NAME } from './constants'
import { IndentTuneConfig } from './types'

Cypress.Commands.add("interceptConsoleErrors", () => {
    cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
    });
})
Cypress.Commands.add("interceptConsoleWarnings", () => {
    cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarning');
    });
})
Cypress.Commands.add("getConsoleWarnings", () => {
    return cy.get('@consoleWarning')
})
Cypress.Commands.add("assertNoConsoleErrors", () => {
    cy.get('@consoleError').should('not.have.been.called');
})
Cypress.Commands.add('applyBiggerGlobalFontSize', () => {
    cy.get("head").then(head => {
        head[0].insertAdjacentHTML("beforeend", /*html*/`<style>.codex-editor__redactor *{
                font-size:1.5rem !important;
            }</style>`)
    })
})

Cypress.Commands.add("loadEditorJsVersion", (version: string, data: any, config: IndentTuneConfig = {}) => {
    cy.window().then(win => {
        return new Cypress.Promise(res => {
            win.editorVersion = version;
            const script = document.createElement("script");
            script.onload = () => {
                win.dispatchEvent(new CustomEvent("loadded-editorjs-script", {
                    detail: {
                        data,
                        config: { version, ...config }
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
        return doc.querySelector(`.${EDITOR_CLASSES.BaseBlock}:nth-child(${index + 1})`) as HTMLElement;
    }) as Cypress.Chainable<BlockSelector>
})
Cypress.Commands.add("getBlockWrapperByIndex", function (index: number) {
    return cy.document().then(function (doc) {
        return doc.querySelector(`.${EDITOR_CLASSES.BaseBlock}:nth-child(${index + 1}) [${WRAPPER_ATTRIBUTE_NAME}]`) as HTMLElement;
    }) as Cypress.Chainable<WrapperSelector>
})

Cypress.Commands.add("getHighlightIndent", { prevSubject: true }, function (prev: JQuery<HTMLElement>) {
    return cy.wrap(prev).find(".ce-highlight-indent");
})

Cypress.Commands.add("getIndentLevel", { prevSubject: true }, function (prev: JQuery<HTMLElement>) {
    return cy.wrap(prev).then($el => parseInt($el.attr("data-indent-level")))
})

Cypress.Commands.add("openToolbarForBlockIndex", function (index: number) {
    cy.get(`.${EDITOR_CLASSES.BaseBlock}:nth-child(${index + 1})`).click();
    cy.get(`.${EDITOR_CLASSES.ToolbarSettings}`).should("be.visible").click()
})

Cypress.Commands.add("indentBlockUsingToolbar", function (direction: "left" | "right", amount: number = 1) {
    const chainableElement = cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-${direction}]`);

    for (let i = 0; i < amount; i++) {
        chainableElement.click()
    }
})


declare global {
    namespace Cypress {
        interface Chainable<Subject = any> {
            // applyEditorSelection(startIndex: number, endIndex: number, version: EditorVersions[keyof EditorVersions]): Cypress.Chainable<void>
            // applyUnderline(): Cypress.Chainable<void>
            interceptConsoleErrors(): Cypress.Chainable<void>;
            interceptConsoleWarnings(): Cypress.Chainable<void>;
            assertNoConsoleErrors(): Cypress.Chainable<void>
            getConsoleWarnings(): Cypress.Chainable<JQuery<HTMLElement>>;
            applyBiggerGlobalFontSize(): Cypress.Chainable<void>
            loadEditorJsVersion(version: string, data: any, config?: IndentTuneConfig): Cypress.Chainable<void>;
            waitForEditorToLoad(): Cypress.Chainable<void>;
            getBlockByIndex(index: number): Cypress.Chainable<BlockSelector>;
            getBlockWrapperByIndex(index: number): Cypress.Chainable<WrapperSelector>;
            openToolbarForBlockIndex(index: number): Cypress.Chainable<void>;
            indentBlockUsingToolbar(direction: "left" | "right", amount?: number): Chainable<void>;
            getHighlightIndent: Subject extends undefined ? never : Subject extends BlockSelector ? (() => Cypress.Chainable<JQuery<HTMLElement>>) : never;
            getIndentLevel: Subject extends undefined ? never : Subject extends WrapperSelector ? (() => Cypress.Chainable<number>) : never;
        }
    }
    interface Window {
        editorVersion: string;
        editor: EditorJS;

    }
}

type WrapperSelector = BlockSelector & { _wrapper: never }
type BlockSelector = JQuery<HTMLElement> & { _blocksel: never }

export { }