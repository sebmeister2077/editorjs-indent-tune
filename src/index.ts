import EditorJS, { type BlockTune, type API, type BlockAPI } from '@editorjs/editorjs'
import { type BlockToolConstructorOptions, type TunesMenuConfig } from '@editorjs/editorjs/types/tools/index.js'
import { IconChevronLeft, IconChevronRight } from '@codexteam/icons'
import './index.css'

const WRAPPER_NAME = 'data-block-indent-wrapper'

export type IndentTuneConfig = Partial<IndentTuneConfigOptions>
export type IndentTuneConfigOptions = Record<'indentSize' | 'maxIndent' | 'minIndent', number> & {
    orientation: 'horizontal' | 'vertical';
    customBlockIndentLimits: Record<string, Partial<Record<'min' | 'max', number>>>;
    /**
     * Custom keyboard indent handler.
     * Return 'indent' or 'unindent' if you want to change the current indentation
     */
    handleShortcut?: ((e: KeyboardEvent) => 'indent' | 'unindent' | undefined | void) | undefined;
    direction: "ltr" | "rtl";
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
    private block: BlockAPI | undefined
    private config: IndentTuneConfigOptions
    public data: IndentData
    private wrapper: HTMLElement | null = null
    constructor({ api, data, config, block }: BlockToolConstructorOptions<IndentData, IndentTuneConfigOptions>) {
        this.api = api
        this.block = block

        const defaultConfig: IndentTuneConfigOptions = {
            indentSize: 24,
            maxIndent: 8,
            minIndent: 0,
            multiblock: false,
            tuneName: null,
            orientation: 'horizontal',
            customBlockIndentLimits: {},
            handleShortcut: undefined,
            direction: "ltr",
        }
        this.config = {
            ...defaultConfig,
            ...(config ?? {}),
        }

        const defaultIndentLevel = this.config.customBlockIndentLimits[this.block?.name ?? '']?.min ?? this.config.minIndent
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
            if (this.data.indentLevel == this.maxIndent)
                this.getTuneButton('indent')?.classList.add(this.CSS.disabledItem)
            if (this.data.indentLevel == this.minIndent)
                this.getTuneButton('unindent')?.classList.add(this.CSS.disabledItem)
        }, 0)

        const indentText = 'Indent'
        const unIndentText = 'Un Indent'
        if (this.config.orientation === 'vertical')
            return [
                {
                    title: this.api.i18n.t(this.isDirectionInverted ? unIndentText : indentText),
                    onActivate: (item, event) => this.handleIndentRight(),
                    icon: IconChevronRight,
                    name: `${this.TuneNames.indentRight}-${this.block?.id}`,
                },
                {
                    title: this.api.i18n.t(this.isDirectionInverted ? indentText : unIndentText),
                    onActivate: (item, event) => this.handleIndentLeft(),
                    icon: IconChevronLeft,
                    name: `${this.TuneNames.indentLeft}-${this.block?.id}`,
                },
            ]

        const html = /*html*/ `
			<div class="${this.CSS.popoverItem} ${this.CSS.customPopoverItem}" data-item-name='indent'>
				<button class="${this.CSS.popoverItemIcon}" data-${this.TuneNames.indentLeft}>${IconChevronLeft}</button>
				<div class="${this.CSS.popoverItemTitle}">${this.api.sanitizer.clean(this.api.i18n.t('Indent'), {})}</div>
				<button class="${this.CSS.popoverItemIcon}" data-${this.TuneNames.indentRight} style="margin-left:10px;">${IconChevronRight}</button>
			</div>
		`

        const item = new DOMParser().parseFromString(html, 'text/html').body.firstChild as HTMLElement

        item.querySelector(`[data-${this.TuneNames.indentRight}]`)?.addEventListener('click', () => this.handleIndentRight())
        item.querySelector(`[data-${this.TuneNames.indentLeft}]`)?.addEventListener('click', () => this.handleIndentLeft())

        return item
    }

    public wrap(pluginsContent: HTMLElement): HTMLElement {
        this.wrapper = document.createElement('div')
        this.wrapper.appendChild(pluginsContent)
        this.wrapper.setAttribute(WRAPPER_NAME, '')

        this.applyStylesToWrapper(this.wrapper, this.data.indentLevel)

        this.wrapper.addEventListener('keydown', (...args) => this.onKeyDown.apply(this, args), { capture: true })

        return this.wrapper
    }

    public save() {
        return this.data
    }

    private get CSS() {
        return {
            customPopoverItem: 'ce-popover-indent-item',
            popoverItem: 'ce-popover-item',
            popoverItemIcon: 'ce-popover-item__icon',
            popoverItemTitle: 'ce-popover-item__title',
            disabledItem: 'ce-popover-item--disabled',
        }
    }

    private get TuneNames() {
        return {
            indentLeft: 'tune-indent-left',
            indentRight: 'tune-indent-right',
        }
    }

    private get customInterval() {
        return this.config.customBlockIndentLimits[this.block?.name ?? ''] ?? {}
    }

    private get maxIndent() {
        return this.customInterval.max ?? this.config.maxIndent
    }

    private get minIndent() {
        return this.customInterval.min ?? this.config.minIndent
    }

    private get isDirectionInverted() {
        return this.config.direction !== 'ltr'; // also ignore invalid directions
    }

    private onKeyDown(e: KeyboardEvent) {
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
            this.block?.dispatchChange()
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

            if (!('tunes' in savedData) || typeof savedData.tunes !== 'object' || !savedData.tunes) {
                console.error('Multiblock indenting is not supported for this editor version. ')
                return
            }

            //this somehow SAVES fine
            const tune = (savedData.tunes as Record<string, IndentData>)[this.config.tuneName ?? ''] as IndentData | undefined
            if (!tune) {
                console.error(`'tuneName' is invalid, no tune was found for block ${b.name}`)
                return
            }
            if (isIndent) tune.indentLevel = Math.min(this.config.maxIndent, (tune.indentLevel ?? 0) + 1)
            else tune.indentLevel = Math.max(0, (tune.indentLevel ?? 0) - 1)
            b.dispatchChange()

            //apply visual feedback manually, since we can't make the tune update on other blocks
            const blockWrapper = this.getWrapperBlockById(b.id)
            if (blockWrapper instanceof HTMLElement) {
                this.applyStylesToWrapper(blockWrapper, tune.indentLevel)
            }
        })
    }

    private handleIndentLeft() {
        if (this.isDirectionInverted)
            this.indentBlock();
        else
            this.unIndentBlock();
    }

    private handleIndentRight() {
        if (this.isDirectionInverted)
            this.unIndentBlock();
        else
            this.indentBlock();
    }

    private indentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.min(this.data.indentLevel + 1, this.maxIndent)

        this.applyStylesToWrapper(this.wrapper, this.data.indentLevel)

        //disable tune
        this.getTuneButton('unindent')?.classList.remove(this.CSS.disabledItem)
        if (this.data.indentLevel === this.maxIndent) {
            this.getTuneButton('indent')?.classList.add(this.CSS.disabledItem)
        }

    }

    private unIndentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.max(this.data.indentLevel - 1, this.minIndent)

        this.applyStylesToWrapper(this.wrapper, this.data.indentLevel)

        // disable tune
        this.getTuneButton('indent')?.classList.remove(this.CSS.disabledItem)
        if (this.data.indentLevel === this.minIndent) {
            this.getTuneButton('unindent')?.classList.add(this.CSS.disabledItem)
        }
    }

    private getTuneButton(indentType: 'indent' | 'unindent') {
        let indentName: 'indentLeft' | "indentRight" = indentType === 'indent' ? "indentRight" : "indentLeft";
        if (this.isDirectionInverted)
            indentName = indentType == 'indent' ? "indentLeft" : "indentRight";

        return this.config.orientation === 'vertical'
            ? this.getTuneByName(`${this.TuneNames[indentName]}-${this.block?.id}`)
            : document.querySelector(`.${this.CSS.popoverItemIcon}[data-${this.TuneNames[indentName]}]`)
    }

    private getTuneByName(name: string) {
        return document.querySelector(`.${this.CSS.popoverItem}[data-item-name="${name}"]`)
    }

    private applyStylesToWrapper(wrapper: HTMLElement, indentLevel: number) {
        const indentValuePixels = `${indentLevel * this.config.indentSize}px`
        if (this.isDirectionInverted) {
            wrapper.style.paddingLeft = '0px';
            wrapper.style.paddingRight = indentValuePixels;
        } else {
            wrapper.style.paddingLeft = indentValuePixels;
            wrapper.style.paddingRight = "0px";
        }
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
