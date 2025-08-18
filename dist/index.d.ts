import { type BlockTune } from '@editorjs/editorjs';
import { type BlockToolConstructorOptions, type TunesMenuConfig } from '@editorjs/editorjs/types/tools/index.js';
import './index.css';
export type TextDirection = 'ltr' | "rtl";
export type IndentTuneConfig = Partial<IndentTuneConfigOptions>;
export type IndentTuneConfigOptions = Record<'indentSize' | 'maxIndent' | 'minIndent', number> & {
    /**
     * Specify the editorjs version so that the styles will match your version
     */
    version?: string;
    /**
     * Enables auto indent if not null or `true`
     * Default disabled.
     */
    autoIndent?: {
        /**
         * Tunes you want to apply auto indent for.
         * Defaults to all.
         */
        tuneNames?: string[];
    } | boolean;
    /**
     * Apply a highlight to the indent if not null
     */
    highlightIndent?: {
        className?: string;
        /**
         * Tunes you want to apply highlight for.
         * Defaults to all.
         */
        tuneNames?: string[];
    };
    orientation: 'horizontal' | 'vertical';
    /**
     * Example:
     * {
     *    tableTuneName: { min: 2, max:8 },
     *    imageTuneName: { min:1 }
     * }
     */
    customBlockIndentLimits: Record<string, Partial<Record<'min' | 'max', number>>>;
    /**
     * Custom keyboard indent handler.
     * Return 'indent' or 'unindent' if you want to change the current indentation.
     * Return 'undefined' or pass 'false' instead of a function to disable the shortcut entirely
     * Return 'default' for default handling
     */
    handleShortcut?: ((e: KeyboardEvent, blockId: string) => 'indent' | 'unindent' | "default" | undefined) | undefined | false;
    /**
     *  `ltr` | `rtl`
     */
    direction: TextDirection;
    /**
     * Handle dynamic direction change (on each block level)
     */
    directionChangeHandler: null | ((listener: (blockId: string, direction: TextDirection) => void) => void);
} & ({
    tuneName: string;
    multiblock: true;
} | {
    tuneName: null;
    multiblock: false;
});
export type IndentData = {
    indentLevel: number;
};
export default class IndentTune implements BlockTune {
    static get isTune(): boolean;
    static DATA_WRAPPER_NAME: string;
    static DATA_FOCUSED: string;
    static DATA_INDENT_LEVEL: string;
    private api;
    private block;
    private config;
    data: IndentData;
    private wrapper;
    private DEFAULT_INDENT_KEY;
    constructor({ api, data, config, block, ...other }: BlockToolConstructorOptions<IndentData, IndentTuneConfigOptions>);
    prepare?(): void | Promise<void>;
    reset?(): void | Promise<void>;
    render(): HTMLElement | TunesMenuConfig;
    wrap(pluginsContent: HTMLElement): HTMLElement;
    save(): IndentData;
    private get CSS();
    private get EditorCSS();
    private get TuneNames();
    private get customInterval();
    private get maxIndent();
    private get minIndent();
    private get isDirectionInverted();
    private get rightText();
    private get leftText();
    private get shouldApplyAutoIndent();
    private handlePropagationForKeyEvent;
    private onKeyDown;
    private handleIndentLeft;
    private handleIndentRight;
    private indentBlock;
    private unIndentBlock;
    private autoIndentBlock;
    private toggleDisableStateForButtons;
    private getTuneButton;
    private getTuneByName;
    private getTuneTitleByName;
    private applyStylesToWrapper;
    private onFocus;
    private onBlur;
    private lastResizeTimeout;
    private onResize;
    private getGlobalSelectedBlocks;
    private getWrapperBlockById;
    private getBlockForWrapper;
    private alignmentChangeListener;
    private createElementFromTemplate;
    private changeConfigBasedOnVersionIfNeeded;
    private cachedMaxWidthForContent;
    private maxWidthForContent;
}
