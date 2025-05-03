import EditorJS from '@editorjs/editorjs'
import { EDITOR_CLASSES, WRAPPER_ATTRIBUTE_NAME } from './constants'
import { IndentTuneConfig } from './types'
import { EditorVersions } from './EditorVersions';

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
Cypress.Commands.add("getConsoleErrors", () => {
    return cy.get("@consoleError")
})
Cypress.Commands.add("getConsoleWarnings", () => {
    return cy.get('@consoleWarning')
})
Cypress.Commands.add("assertNoConsoleErrors", () => {
    cy.getConsoleErrors().should('not.have.been.called');
})
Cypress.Commands.add('applyBiggerGlobalFontSize', () => {
    cy.get("head").then(head => {
        head[0].insertAdjacentHTML("beforeend", /*html*/`<style>.codex-editor__redactor *{
                font-size:1.5rem !important;
            }</style>`)
    })
})

Cypress.Commands.add("loadEditorJsVersion", (version: string, data: any, config: IndentTuneConfig = {}, editorConfig: Object = {}) => {
    cy.window().then(win => {
        return new Cypress.Promise(res => {
            win.editorVersion = version;
            const script = document.createElement("script");
            script.onload = () => {
                win.dispatchEvent(new CustomEvent("loadded-editorjs-script", {
                    detail: {
                        data,
                        config: { version, ...config },
                        editorConfig
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
    cy.log("Returning indent level")
    return cy.wrap(prev).then($el => parseInt($el.attr("data-indent-level")))
})

Cypress.Commands.add("openToolbarForBlockIndex", function (index: number) {
    cy.get(`.${EDITOR_CLASSES.BaseBlock}:nth-child(${index + 1})`).click();
    cy.get(`.${EDITOR_CLASSES.ToolbarSettings}`).should("be.visible").click()
})

Cypress.Commands.add("indentBlockUsingToolbar", function (direction: "left" | "right", amount: number = 1) {
    const chainableElement = cy.get(`.${EDITOR_CLASSES.ToolbarIndentRoot} [data-tune-indent-${direction}]`);

    for (let i = 0; i < amount; i++) {
        chainableElement.click({
            // force: true
        })
    }
})


Cypress.Commands.add("indentUsingKeybord", function (action: "indent" | "unindent", amount: number = 1) {
    const defaultKey = "Tab";

    cy.window().then(win => {
        cy.get(`[${WRAPPER_ATTRIBUTE_NAME}]`)
            // .trigger("keydown", {
            //     key: defaultKey,
            //     code: defaultKey,
            //     bubbles: true,
            //     shiftKey: action === 'unindent'
            // })
            .then(function ($el) {
                const e = new KeyboardEvent('keydown', {
                    key: defaultKey,
                    code: defaultKey,
                    bubbles: true,
                    shiftKey: action === 'unindent'
                });
                for (let i = 0; i < amount; i++) {
                    cy.wait(10).then(() => {
                        $el[0].dispatchEvent(e);
                    })
                }
                cy.log("Trigger keydowns")
            });
    })

})


Cypress.Commands.add("applyEditorSelection", (startIndex, endIndex, version) => {
    const selectedBlockClass = "ce-block--selected"
    const maxIndex = Math.max(startIndex, endIndex);
    const minIndex = Math.min(startIndex, endIndex);

    function getBlockElementById(index: number) {
        return cy.get(`.codex-editor__redactor .ce-block:nth-child(${index + 1})`)
    }

    //? Important note, in the fixture please add more blocks than selected blocks so it works with v2.22 and down too
    cy.get(`.codex-editor__redactor .ce-block:nth-child(-n+${maxIndex + 1}):nth-child(n+${minIndex + 1}) [contenteditable]`)
        .last()
        .trigger('mousedown')
        .then(($el) => {
            const el = $el[0]
            const document = el.ownerDocument
            const range = document.createRange()
            range.selectNodeContents(el)
            document.getSelection().removeAllRanges()
            document.getSelection().addRange(range)
        })
        .trigger('mouseup')
    cy.document().then(doc => {
        doc.getSelection().removeAllRanges();
    })


    for (let i = startIndex; i < endIndex + 1; i++) {
        getBlockElementById(i).then($block => {
            $block.addClass(selectedBlockClass)
        })
    }
    cy.get(".codex-editor__redactor").trigger("click").trigger("mouseup")
})
declare global {
    namespace Cypress {
        interface Chainable<Subject = any> {
            applyEditorSelection(startIndex: number, endIndex: number, version: EditorVersions[keyof EditorVersions]): Cypress.Chainable<void>
            // applyUnderline(): Cypress.Chainable<void>
            interceptConsoleErrors(): Cypress.Chainable<void>;
            interceptConsoleWarnings(): Cypress.Chainable<void>;
            getConsoleErrors(): Cypress.Chainable<JQuery<HTMLElement>>;
            assertNoConsoleErrors(): Cypress.Chainable<void>
            getConsoleWarnings(): Cypress.Chainable<JQuery<HTMLElement>>;
            applyBiggerGlobalFontSize(): Cypress.Chainable<void>
            loadEditorJsVersion(version: string, data: any, config?: IndentTuneConfig, editorConfig?: Object): Cypress.Chainable<void>;
            waitForEditorToLoad(): Cypress.Chainable<void>;
            getBlockByIndex(index: number): Cypress.Chainable<BlockSelector>;
            getBlockWrapperByIndex(index: number): Cypress.Chainable<WrapperSelector>;
            openToolbarForBlockIndex(index: number): Cypress.Chainable<void>;
            indentBlockUsingToolbar(direction: "left" | "right", amount?: number): Chainable<void>;
            indentUsingKeybord(action: "indent" | "unindent", amount?: number): Chainable<void>;
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