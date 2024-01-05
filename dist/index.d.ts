import { type BlockTune } from '@editorjs/editorjs';
import { type BlockToolConstructorOptions, type TunesMenuConfig } from '@editorjs/editorjs/types/tools/index.js';
export type IndentTuneConfig = Record<'indentSize' | 'maxIndent' | 'minIndent', number> & {
    tuneName: string | null;
    multiblock: boolean;
    orientation: 'horizontal' | 'vertical';
};
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
    private indentBlock;
    private unIndentBlock;
    private getTuneButton;
    private getTuneByName;
    private applyStylesToWrapper;
    private getGlobalSelectedBlocks;
    private getWrapperBlockById;
}
