import { type BlockTune } from '@editorjs/editorjs';
import { type BlockToolConstructorOptions, type TunesMenuConfig } from '@editorjs/editorjs/types/tools/index.js';
import './index.css';
export type TextDirection = 'ltr' | "rtl";
export type IndentTuneConfig = Partial<IndentTuneConfigOptions>;
export type IndentTuneConfigOptions = Record<'indentSize' | 'maxIndent' | 'minIndent', number> & {
    highlightIndent?: {
        className?: string;
    };
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
    private api;
    private block;
    private config;
    data: IndentData;
    private wrapper;
    private DEFAULT_INDENT_KEY;
    constructor({ api, data, config, block }: BlockToolConstructorOptions<IndentData, IndentTuneConfigOptions>);
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
    private onKeyDown;
    private handleIndentLeft;
    private handleIndentRight;
    private indentBlock;
    private unIndentBlock;
    private toggleDisableStateForButtons;
    private getTuneButton;
    private getTuneByName;
    private getTuneTitleByName;
    private applyStylesToWrapper;
    private getGlobalSelectedBlocks;
    private getWrapperBlockById;
    private alignmentChangeListener;
    private createElementFromTemplate;
}
