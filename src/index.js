import { API, BlockAPI, BlockTune, BlockTuneConstructable, SanitizerConfig } from '@editorjs/editorjs'
import { BlockTuneData } from '@editorjs/editorjs/types/block-tunes/block-tune-data'
import { ToolConstructable, TunesMenuConfig } from '@editorjs/editorjs/types/tools'
//@ts-ignore
import Shortcut from '@codexteam/shortcuts'
import { LEFT_ARROW_ICON, RIGHT_ARROW_ICON } from './icons'

const INDENT_STEP = 30
const MAX_INDENT = 8
export default class IndentTune {
    static get isTune() {
        return true
    }

    constructor({ api, data, config, block }) {
        this.api = api
        this.block = block
        this.config = { indentSize: 24, maxIndent: 8, ...(config ?? {}) }
        this.data = { indentLevel: 0, ...(data ?? {}) }
    }

    // prepare?(): void | Promise<void> {
    // }
    // reset?(): void | Promise<void> {
    // }

    /**
     * @returns {HTMLElement | TunesMenuConfig}
     */
    render() {
        //Disable items after they are rendered synchronously
        setTimeout(() => {
            if (this.data.indentLevel == MAX_INDENT)
                this.getTuneByName(`${this.TuneNames.indent}-${this.block.id}`)?.classList.add(this.CSS.disabledItem)
            if (this.data.indentLevel == 0)
                this.getTuneByName(`${this.TuneNames.unindent}-${this.block.id}`)?.classList.add(this.CSS.disabledItem)
        }, 0)

        return [
            {
                title: 'Indent',
                onActivate: (item, event) => this.indentBlock(),
                icon: RIGHT_ARROW_ICON,
                name: `${this.TuneNames.indent}-${this.block.id}`,
            },
            {
                title: 'Un indent',
                onActivate: (item, event) => this.unIndentBlock(),
                icon: LEFT_ARROW_ICON,
                name: `${this.TuneNames.unindent}-${this.block.id}`,
            },
        ]
    }

    /**
     * @param {HTMLElement} pluginsContent
     * @returns {HTMLElement}
     */
    wrap(pluginsContent) {
        this.wrapper = document.createElement('div')
        this.wrapper.appendChild(pluginsContent)
        this.wrapper.style.paddingLeft = `${this.data.indentLevel * INDENT_STEP}px`

        this.wrapper.addEventListener(
            'keydown',
            (e) => {
                if (e.key !== 'Tab') return
                const activeBlockName = this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex())?.name
                //ignore paragraph list since it has its internal function for this
                if (activeBlockName === 'paragraphList') return
                e.stopPropagation()
                e.preventDefault()

                if (e.shiftKey) this.unIndentBlock()
                else this.indentBlock()
            },
            { capture: true },
        )

        return this.wrapper
    }

    get CSS() {
        return {
            popoverItem: 'ce-popover-item',
            disabledItem: 'ce-popover-item--disabled',
        }
    }

    get TuneNames() {
        return {
            indent: 'tune-indent',
            unindent: 'tune-unindent',
        }
    }

    indentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.min(this.data.indentLevel + 1, MAX_INDENT)

        this.wrapper.style.paddingLeft = `${this.data.indentLevel * INDENT_STEP}px`

        //disable tune
        this.getTuneByName(`${this.TuneNames.unindent}-${this.block.id}`)?.classList.remove(this.CSS.disabledItem)
        if (this.data.indentLevel == MAX_INDENT)
            this.getTuneByName(`${this.TuneNames.indent}-${this.block.id}`)?.classList.add(this.CSS.disabledItem)
    }

    unIndentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.max(this.data.indentLevel - 1, 0)

        this.wrapper.style.paddingLeft = `${this.data.indentLevel * INDENT_STEP}px`

        //disable tune
        this.getTuneByName(`${this.TuneNames.indent}-${this.block.id}`)?.classList.remove(this.CSS.disabledItem)
        if (this.data.indentLevel == 0)
            this.getTuneByName(`${this.TuneNames.unindent}-${this.block.id}`)?.classList.add(this.CSS.disabledItem)
    }

    /**
     * @param {string} name
     * @returns {HTMLElement}
     */
    getTuneByName(name) {
        return document.querySelector(`.${this.CSS.popoverItem}[data-item-name=${name}]`)
    }

    save() {
        return this.data
    }
}
