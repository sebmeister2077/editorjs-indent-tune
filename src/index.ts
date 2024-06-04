import EditorJS, { type BlockTune, type API, type BlockAPI } from '@editorjs/editorjs'
import { type BlockToolConstructorOptions, type TunesMenuConfig } from '@editorjs/editorjs/types/tools/index.js'
import { IconChevronLeft, IconChevronRight } from '@codexteam/icons'
import './index.css'

const WRAPPER_NAME = 'data-block-indent-wrapper'

export type TextDirection = 'ltr' | "rtl"

export type IndentTuneConfig = Partial<IndentTuneConfigOptions>
export type IndentTuneConfigOptions = Record<'indentSize' | 'maxIndent' | 'minIndent', number> & {
    orientation: 'horizontal' | 'vertical';
    customBlockIndentLimits: Record<string, Partial<Record<'min' | 'max', number>>>;
    /**
     * Custom keyboard indent handler.
     * Return 'indent' or 'unindent' if you want to change the current indentation.
     * Return 'undefined' or pass 'false' instead of a function to disable the shortcut entirely
     */
    handleShortcut?: ((e: KeyboardEvent, blockId: string) => 'indent' | 'unindent' | "default" | undefined) | undefined | false;
    direction: TextDirection;
    /**
     * Handle dynamic direction change (on each block level)
     */
    directionChangeHandler: null | ((listener: (blockId: string, direction: TextDirection) => void) => void);
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
    public static get isTune() {
        return true
    }

    private api: API
    private block: BlockAPI | undefined
    private config: IndentTuneConfigOptions
    public data: IndentData
    private wrapper: HTMLElement = document.createElement('div')
    private DEFAULT_INDENT_KEY = 'Tab';
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
            directionChangeHandler: null,
        }
        this.config = {
            ...defaultConfig,
            ...(config ?? {}),
        }

        if (this.config?.directionChangeHandler) {
            this.config.directionChangeHandler(this.alignmentChangeListener.bind(this));
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
        queueMicrotask(() => {
            if (this.data.indentLevel == this.maxIndent)
                this.getTuneButton('indent')?.classList.add(this.CSS.disabledItem)
            if (this.data.indentLevel == this.minIndent)
                this.getTuneButton('unindent')?.classList.add(this.CSS.disabledItem)
        })


        if (this.config.orientation === 'vertical') {
            const leftElementName = `${this.TuneNames.indentLeft}-${this.block?.id}`;
            const rightElementName = `${this.TuneNames.indentRight}-${this.block?.id}`
            return [
                {
                    title: this.rightText,
                    onActivate: (item, event) => {
                        this.handleIndentRight();
                        // override editorjs internal title copy
                        item.title = this.rightText;
                    },
                    icon: IconChevronRight,
                    name: rightElementName,
                },
                {
                    title: this.leftText,
                    onActivate: (item, event) => {
                        this.handleIndentLeft()
                        item.title = this.leftText;
                    },
                    icon: IconChevronLeft,
                    name: leftElementName,
                },
            ]
        }

        const html = /*html*/ `
			<div class="${this.CSS.popoverItem} ${this.CSS.customPopoverItem}" data-item-name='indent'>
				<button type="button" class="${this.CSS.popoverItemIcon}" data-${this.TuneNames.indentLeft}>${IconChevronLeft}</button>
				<div class="${this.CSS.popoverItemTitle}">${this.api.sanitizer.clean(this.api.i18n.t('Indent'), {})}</div>
				<button type="button" class="${this.CSS.popoverItemIcon}" data-${this.TuneNames.indentRight} style="margin-left:10px;">${IconChevronRight}</button>
			</div>
		`

        const item = new DOMParser().parseFromString(html, 'text/html').body.firstChild as HTMLElement

        item.querySelector(`[data-${this.TuneNames.indentRight}]`)?.addEventListener('click', () => this.handleIndentRight())
        item.querySelector(`[data-${this.TuneNames.indentLeft}]`)?.addEventListener('click', () => this.handleIndentLeft())

        return item
    }

    public wrap(pluginsContent: HTMLElement): HTMLElement {
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

    private get rightText() {
        return this.api.i18n.t(this.isDirectionInverted ? 'Un Indent' : 'Indent')
    }

    private get leftText() {
        return this.api.i18n.t(this.isDirectionInverted ? 'Indent' : 'Un Indent')
    }

    private onKeyDown(e: KeyboardEvent) {
        if (!this.block?.id) return;
        // omit key shortcut entirely
        if (this.config.handleShortcut === false) return;

        const isDefaultKeyPressed = e.key == this.DEFAULT_INDENT_KEY
        const isCustomBehaviourDefined = typeof this.config.handleShortcut === 'function'

        if (!isCustomBehaviourDefined && !isDefaultKeyPressed) return

        const handledCommand = this.config.handleShortcut?.(e, this.block.id)
        const shouldIgnoreKeyPress = !handledCommand && isCustomBehaviourDefined
        if (shouldIgnoreKeyPress) return

        let isIndent: boolean;
        switch (handledCommand) {
            case 'indent':
                isIndent = true;
                break
            case 'unindent':
                isIndent = false;
                break;
            case 'default':
            default:
                if (!isDefaultKeyPressed) return;
                isIndent = !e.shiftKey
        }

        e.stopPropagation()
        e.preventDefault()

        //this might be still open
        this.api.inlineToolbar.close()
        const selectedBlocks = this.getGlobalSelectedBlocks()
        const isSingleLineBlock = !this.config.multiblock || selectedBlocks.length < 2
        if (isSingleLineBlock) {
            if (isIndent) this.indentBlock()
            else this.unIndentBlock()
            this.block.dispatchChange()
            return
        }

        if (!Boolean(this.config.tuneName)) {
            console.error(`'tuneName' is empty.`)
            return
        }

        selectedBlocks.forEach(async (b) => {
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
        this.block?.dispatchChange()
    }

    private handleIndentRight() {
        if (this.isDirectionInverted)
            this.unIndentBlock();
        else
            this.indentBlock();
        this.block?.dispatchChange()
    }

    private indentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.min(this.data.indentLevel + 1, this.maxIndent)

        this.applyStylesToWrapper(this.wrapper, this.data.indentLevel)

        this.toggleDisableStateForButtons()
    }

    private unIndentBlock() {
        if (!this.wrapper) return
        this.data.indentLevel = Math.max(this.data.indentLevel - 1, this.minIndent)

        this.applyStylesToWrapper(this.wrapper, this.data.indentLevel)

        this.toggleDisableStateForButtons()
    }

    private toggleDisableStateForButtons() {
        if (this.data.indentLevel === this.minIndent)
            this.getTuneButton('unindent')?.classList.add(this.CSS.disabledItem)
        else
            this.getTuneButton('unindent')?.classList.remove(this.CSS.disabledItem)

        if (this.data.indentLevel === this.maxIndent)
            this.getTuneButton('indent')?.classList.add(this.CSS.disabledItem)
        else
            this.getTuneButton('indent')?.classList.remove(this.CSS.disabledItem)
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

    private getTuneTitleByName(name: string) {
        return this.getTuneByName(name)?.querySelector(`.${this.CSS.popoverItemTitle}`)
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

    private alignmentChangeListener(blockId: string, direction: TextDirection) {
        if (blockId !== this.block?.id) return;
        const hasDirectionChanged = direction !== this.config.direction
        if (!hasDirectionChanged) return

        this.config.direction = direction;
        this.applyStylesToWrapper(this.wrapper, this.data.indentLevel)
        this.toggleDisableStateForButtons()
        if (this.config.orientation === 'vertical') {
            // I have to update the text for the indent options 😪

            const indentRightBtnTitle = this.getTuneTitleByName(`${this.TuneNames.indentRight}-${this.block?.id}`);
            if (indentRightBtnTitle) indentRightBtnTitle.textContent = this.rightText

            const indentLeftBtnTitle = this.getTuneTitleByName(`${this.TuneNames.indentLeft}-${this.block?.id}`);
            if (indentLeftBtnTitle) indentLeftBtnTitle.textContent = this.leftText
        }
    }
}
