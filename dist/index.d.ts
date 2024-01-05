import { type BlockTune } from '@editorjs/editorjs';
import { type BlockToolConstructorOptions, type TunesMenuConfig } from '@editorjs/editorjs/types/tools/index.js';
export type IndentTuneConfig = Record<'indentSize' | 'maxIndent' | 'minIndent', number> & {
    orientation: 'horizontal' | 'vertical';
    customBlockIndentLimits: Record<string, Partial<Record<'min' | 'max', number>>>;
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
    constructor({ api, data, config, block }: BlockToolConstructorOptions<IndentData, IndentTuneConfig>);
    render(): HTMLElement | TunesMenuConfig;
    wrap(pluginsContent: HTMLElement): HTMLElement;
    save(): IndentData;
    private get CSS();
    private get TuneNames();
    private get customInterval();
    private indentBlock;
    private unIndentBlock;
    private getTuneButton;
    private getTuneByName;
    private applyStylesToWrapper;
    private getGlobalSelectedBlocks;
    private getWrapperBlockById;
}
