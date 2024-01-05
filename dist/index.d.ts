import { type BlockTune } from '@editorjs/editorjs';
import { BlockToolConstructorOptions, type TunesMenuConfig } from '@editorjs/editorjs/types/tools/index.js';
import './index.css';
import { IndentData, IndentTuneConfig } from './types';
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
