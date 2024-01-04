# Block indentation tune tool for Editor.js

You can add indentation to any block.

## How to use

1. Install

```shell
npm i editorjs-block-indent-blocktune
```

2. Connect

```js
import EditorJS from '@editorjs/editorjs'
import IndentTune from 'editorjs-block-indent-blocktune'

/**
 * Editor.js configuration
 */
const editor = new EditorJS({
    /**
     * Connect tool
     */
    tools: {
        indentTune: IndentTune,
    },

    /**
     * Apply to all the blocks
     */
    tunes: ['indentTune'],

    // ...
})
```

Optionally, you can connect this Tune only for specified blocks:

```js
import EditorJS from '@editorjs/editorjs'
import TextVariantTune from '@editorjs/text-variant-tune'

/**
 * Editor.js configuration
 */
const editor = new EditorJS({
    tools: {
        textVariant: TextVariantTune,
        paragraph: {
            // apply only for the 'paragraph' tool
            tunes: ['textVariant'],
        },
    },
})
```

## Config Params

| Field      | Type     | Description                          | Default |
| ---------- | -------- | ------------------------------------ | ------- |
| indentSize | `number` | Size of one indent level (in pixels) | 24      |
| maxIndent  | `number` | The upper indent limit of the block  | 8       |
