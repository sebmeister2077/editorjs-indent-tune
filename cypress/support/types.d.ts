export type TextDirection = 'ltr' | "rtl"

export type IndentTuneConfig = Partial<IndentTuneConfigOptions>
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
        tuneNames?: string[]
    } | boolean;
    /**
     * Apply a highlight to the indent if not null
     */
    highlightIndent?: {
        className?: string,
        /**
         * Tunes you want to apply highlight for.
         * Defaults to all.
         */
        tuneNames?: string[]
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