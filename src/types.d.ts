export type IndentTuneConfig = Record<'indentSize' | 'maxIndent' | 'minIndent', number> & {
    tuneName: string | null
    multiblock: boolean
    orientation: 'horizontal' | 'vertical'
}

export type IndentData = { indentLevel: number }
