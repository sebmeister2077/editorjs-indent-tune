import { LEFT_ARROW_ICON, RIGHT_ARROW_ICON } from './icons.js'

export default class IndentTune {
    static get isTune() {
        return true
    }

    constructor({ api, data, config, block }) {
        this.api = api
        this.block = block
        this.config = { indentSize: 24, maxIndent: 8, multiblock: false, tuneName: null, orientation: 'horizontal', ...(config ?? {}) }
        this.data = { indentLevel: 0, ...(data ?? {}) }

        if (multiblock && !tuneName)
            console.error("IndentTune config 'tuneName' was not provided, this is required for multiblock option to work.")
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
            if (this.data.indentLevel == this.config.maxIndent) this.getTuneButton('indent')?.classList.add(this.CSS.disabledItem)
            if (this.data.indentLevel == 0) this.getTuneButton('unindent')?.classList.add(this.CSS.disabledItem)
        }, 0)

        if (this.config.orientation === 'horizontal')
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
        const html = /*html*/ `
			<div class="${this.CSS.popoverItem} ${this.CSS.customPopoverItem}" data-item-name='indent'>
				<button class="${this.CSS.popoverItemIcon}" data-unindent>${LEFT_ARROW_ICON}</button>
				<div class="${this.CSS.popoverItemTitle}">Indent</div>
				<button class="${this.CSS.popoverItemIcon}" data-indent style="margin-left:10px;">${RIGHT_ARROW_ICON}</button>
			</div>
		`

        const item = new DOMParser().parseFromString(html, 'text/html').body.firstChild

        item.querySelector('[data-indent]')?.addEventListener('click', () => this.indentBlock())
        item.querySelector('[data-unindent]')?.addEventListener('click', () => this.unIndentBlock())

        return item
    }

    /**
     * @param {HTMLElement} pluginsContent
     * @returns {HTMLElement}
     */
    wrap(pluginsContent) {
        this.wrapper = document.createElement('div')
        this.wrapper.appendChild(pluginsContent)
        this.wrapper.setAttribute(WRAPPER_NAME, '')
        this.wrapper.style.paddingLeft = `${this.data.indentLevel * this.config.indentSize}px`

        this.wrapper.addEventListener(
            'keydown',
            (e) => {
                if (e.key !== 'Tab') return
                e.stopPropagation()
                e.preventDefault()

                const isIndent = !e.shiftKey
                const blocks = this.getGlobalSelectedBlocks()

                if (!this.config.multiblock || blocks.length < 2) {
                    if (isIndent) this.indentBlock()
                    else this.unIndentBlock()
                    b.dispatchChange()
                    return
                }

                blocks.forEach(async (b) => {
                    //get block indent level
                    const savedData = await b.save()
                    if (!savedData) return

                    //this somehow SAVES fine
                    const tune = savedData.tunes[this.config.tuneName]
                    console.assert(Boolean(tune), `'tuneName' is invalid, no tune was found for block ${b.name}`)
                    if (isIndent) tune.indentLevel = Math.min(MAX_INDENT, (tune.indentLevel ?? 0) + 1)
                    else tune.indentLevel = Math.max(0, (tune.indentLevel ?? 0) - 1)
                    b.dispatchChange()

                    //apply visual feedback manually, since we can't make the tune update on other blocks
                    const blockWrapper = this.getWrapperBlockById(b.id)
                    if (blockWrapper instanceof HTMLElement) {
                        this.applyStylesToWrapper(blockWrapper, tune.indentLevel)
                    }
                })
            },
            { capture: true },
        )

        return this.wrapper
    }

    get CSS() {
        return {
            cusotmPopoverItem: ' ce-popover-item-custom',
            popoverItem: 'ce-popover-item',
            popoverItemIcon: 'ce-popover-item__icon',
            popoverItemTitle: 'ce-popover-item__title',
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
        this.data.indentLevel = Math.min(this.data.indentLevel + 1, this.config.maxIndent)

        this.applyStylesToWrapper(this.wrapper)

        //disable tune
        this.getTuneButton('unindent')?.classList.remove(this.CSS.disabledItem)
        if (this.data.indentLevel == this.config.maxIndent) this.getTuneButton('indent')?.classList.add(this.CSS.disabledItem)
    }

    unIndentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.max(this.data.indentLevel - 1, 0)

        this.applyStylesToWrapper(this.wrapper)

        // disable tune
        this.getTuneButton('indent')?.classList.remove(this.CSS.disabledItem)
        if (this.data.indentLevel == 0) this.getTuneButton('unindent')?.classList.add(this.CSS.disabledItem)
    }

    getTuneButton(indentType) {
        return this.config.orientation === 'vertical'
            ? this.getTuneByName(`${this.TuneNames[indentType]}[data-item-name=${this.block.id}]`)
            : document.querySelector(`.${this.CSS.popoverItemIcon}[data-${indentType}]`)
    }
    /**
     * @param {string} name
     * @returns {HTMLElement}
     */
    getTuneByName(name) {
        return document.querySelector(`.${this.CSS.popoverItem}[data-item-name=${name}]`)
    }

    /**
     *
     * @param {HTMLElement} wrapper
     * @param {number} indentLevel
     */
    applyStylesToWrapper(wrapper, indentLevel) {
        wrapper.style.paddingLeft = `${indentLevel * this.config.indentSize}px`
    }

    /**
     * @returns {BlockAPI[]}
     */
    getGlobalSelectedBlocks() {
        const crossSelectedBlocks = new Array(this.api.blocks.getBlocksCount())
            .fill(0)
            .map((_, idx) => this.api.blocks.getBlockByIndex(idx))
            .filter((b) => !!b?.selected)
        return crossSelectedBlocks
    }

    /**
     * @param {string} blockId
     * @returns {HTMLElement | null}
     */
    getWrapperBlockById(blockId) {
        return document.querySelector(`.ce-block[data-id="${blockId}"] [${WRAPPER_NAME}]`)
    }

    save() {
        return this.data
    }
}
