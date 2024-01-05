import { type BlockTune, type API, type BlockAPI } from '@editorjs/editorjs'
import { type BlockToolConstructorOptions, type TunesMenuConfig } from '@editorjs/editorjs/types/tools/index.js'
import { LEFT_ARROW_ICON, RIGHT_ARROW_ICON } from './icons'
const WRAPPER_NAME = 'data-block-indent-wrapper'

require('./index.css').toString()

export type IndentTuneConfig = Partial<IndentTuneConfigOptions>
export type IndentTuneConfigOptions = Record<'indentSize' | 'maxIndent' | 'minIndent', number> & {
    orientation: 'horizontal' | 'vertical'
    customBlockIndentLimits: Record<string, Partial<Record<'min' | 'max', number>>>
    /**
     * Custom keyboard indent handler.
     * Return 'indent' or 'unindent' if you want to change the current indentation
     */
    handleShortcut?: ((e: KeyboardEvent) => 'indent' | 'unindent' | undefined | void) | undefined
} & (
        | {
              tuneName: string
              multiblock: true
          }
        | {
              tuneName: null
              multiblock: false
          }
    )

export type IndentData = { indentLevel: number }
export default class IndentTune implements BlockTune {
    static get isTune() {
        return true
    }

    private api: API
    private block: BlockAPI
    private config: IndentTuneConfigOptions
    public data: IndentData
    private wrapper: HTMLElement | null = null
    constructor({ api, data, config, block }: BlockToolConstructorOptions<IndentData, IndentTuneConfigOptions>) {
        this.api = api
        this.block = block!

        const defaultConfig: IndentTuneConfigOptions = {
            indentSize: 24,
            maxIndent: 8,
            minIndent: 0,
            multiblock: false,
            tuneName: null,
            orientation: 'horizontal',
            customBlockIndentLimits: {},
            handleShortcut: undefined,
        }
        this.config = {
            ...defaultConfig,
            ...(config ?? {}),
        }

        const defaultIndentLevel = this.config.customBlockIndentLimits[this.block.name]?.min ?? this.config.minIndent
        this.data = {
            //@ts-ignore
            indentLevel: defaultIndentLevel,
            ...(data ?? {}),
        }

        if (this.config.multiblock && !this.config.tuneName)
            console.error("IndentTune config 'tuneName' was not provided, this is required for multiblock option to work.")
    }

    // prepare?(): void | Promise<void> {
    // }
    // reset?(): void | Promise<void> {
    // }

    public render(): HTMLElement | TunesMenuConfig {
        //Disable items after they are rendered synchronously
        setTimeout(() => {
            if (this.data.indentLevel == this.config.maxIndent) this.getTuneButton('indent')?.classList.add(this.CSS.disabledItem)
            if (this.data.indentLevel == 0) this.getTuneButton('unindent')?.classList.add(this.CSS.disabledItem)
        }, 0)

        if (this.config.orientation === 'vertical')
            return [
                {
                    title: this.api.i18n.t('Indent'),
                    onActivate: (item, event) => this.indentBlock(),
                    icon: RIGHT_ARROW_ICON,
                    name: `${this.TuneNames.indent}-${this.block.id}`,
                },
                {
                    title: this.api.i18n.t('Un Indent'),
                    onActivate: (item, event) => this.unIndentBlock(),
                    icon: LEFT_ARROW_ICON,
                    name: `${this.TuneNames.unindent}-${this.block.id}`,
                },
            ]

        const html = /*html*/ `
			<div class="${this.CSS.popoverItem} ${this.CSS.customPopoverItem}" data-item-name='indent'>
				<button class="${this.CSS.popoverItemIcon}" data-unindent>${LEFT_ARROW_ICON}</button>
				<div class="${this.CSS.popoverItemTitle}">${this.api.i18n.t('Indent')}</div>
				<button class="${this.CSS.popoverItemIcon}" data-indent style="margin-left:10px;">${RIGHT_ARROW_ICON}</button>
			</div>
		`

        const item = new DOMParser().parseFromString(html, 'text/html').body.firstChild as HTMLElement

        item.querySelector('[data-indent]')?.addEventListener('click', () => this.indentBlock())
        item.querySelector('[data-unindent]')?.addEventListener('click', () => this.unIndentBlock())

        return item
    }

    public wrap(pluginsContent: HTMLElement): HTMLElement {
        this.wrapper = document.createElement('div')
        this.wrapper.appendChild(pluginsContent)
        this.wrapper.setAttribute(WRAPPER_NAME, '')
        this.wrapper.style.paddingLeft = `${this.data.indentLevel * this.config.indentSize}px`

        this.wrapper.addEventListener(
            'keydown',
            (e) => {
                const omitDefaultBehaviour = Boolean(this.config.handleShortcut)
                if (!omitDefaultBehaviour && e.key !== 'Tab') return
                const handled = this.config.handleShortcut?.(e)
                if (handled && omitDefaultBehaviour) return

                e.stopPropagation()
                e.preventDefault()

                //this might be still open
                this.api.inlineToolbar.close()
                const isIndent = handled ? handled === 'indent' : !e.shiftKey
                const blocks = this.getGlobalSelectedBlocks()

                if (!this.config.multiblock || blocks.length < 2) {
                    if (isIndent) this.indentBlock()
                    else this.unIndentBlock()
                    this.block.dispatchChange()
                    return
                }

                if (!Boolean(this.config.tuneName)) {
                    console.error(`'tuneName' is empty.`)
                    return
                }

                blocks.forEach(async (b) => {
                    //get block indent level
                    const savedData = await b.save()
                    if (!savedData) return

                    //this somehow SAVES fine
                    const tune = (savedData as any).tunes?.[this.config.tuneName!]
                    console.assert(Boolean(tune), `'tuneName' is invalid, no tune was found for block ${b.name}`)
                    if (isIndent) tune.indentLevel = Math.min(this.config.maxIndent, (tune.indentLevel ?? 0) + 1)
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

    public save() {
        return this.data
    }

    private get CSS() {
        return {
            customPopoverItem: ' ce-popover-item-custom',
            popoverItem: 'ce-popover-item',
            popoverItemIcon: 'ce-popover-item__icon',
            popoverItemTitle: 'ce-popover-item__title',
            disabledItem: 'ce-popover-item--disabled',
        }
    }

    private get TuneNames() {
        return {
            indent: 'tune-indent',
            unindent: 'tune-unindent',
        }
    }

    private get customInterval() {
        return this.config.customBlockIndentLimits[this.block.name]
    }

    private indentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.min(this.data.indentLevel + 1, this.customInterval.max ?? this.config.maxIndent)

        this.applyStylesToWrapper(this.wrapper, this.data.indentLevel)

        //disable tune
        this.getTuneButton('unindent')?.classList.remove(this.CSS.disabledItem)
        if (this.data.indentLevel == this.config.maxIndent) this.getTuneButton('indent')?.classList.add(this.CSS.disabledItem)
    }

    private unIndentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.max(this.data.indentLevel - 1, this.customInterval.min ?? this.config.minIndent)

        this.applyStylesToWrapper(this.wrapper, this.data.indentLevel)

        // disable tune
        this.getTuneButton('indent')?.classList.remove(this.CSS.disabledItem)
        if (this.data.indentLevel == 0) this.getTuneButton('unindent')?.classList.add(this.CSS.disabledItem)
    }

    private getTuneButton(indentType: 'indent' | 'unindent') {
        return this.config.orientation === 'vertical'
            ? this.getTuneByName(`${this.TuneNames[indentType]}[data-item-name=${this.block.id}]`)
            : document.querySelector(`.${this.CSS.popoverItemIcon}[data-${indentType}]`)
    }

    private getTuneByName(name: string) {
        return document.querySelector(`.${this.CSS.popoverItem}[data-item-name=${name}]`)
    }

    private applyStylesToWrapper(wrapper: HTMLElement, indentLevel: number) {
        wrapper.style.paddingLeft = `${indentLevel * this.config.indentSize}px`
    }

    private getGlobalSelectedBlocks() {
        const crossSelectedBlocks = new Array(this.api.blocks.getBlocksCount())
            .fill(0)
            .map((_, idx) => this.api.blocks.getBlockByIndex(idx))
            .filter((b): b is BlockAPI => !!b?.selected)
        return crossSelectedBlocks
    }

    private getWrapperBlockById(blockId: string) {
        return document.querySelector(`.ce-block[data-id="${blockId}"] [${WRAPPER_NAME}]`)
    }
}
