# Block indentation tune tool for Editor.js

You can add indentation to any block.

![readme](./assets/example1.gif)

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
import IndentTune from 'editorjs-block-indent-blocktune'

/**
 * Editor.js configuration
 */
const editor = new EditorJS({
    tools: {
        indentTune: IndentTune,
        paragraph: {
            // apply only for the 'paragraph' tool
            tunes: ['indentTune'],
        },
    },
})
```

## Config Params (optional)

| Field                   | Type                                                      | Description                                                   | Default      |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------------------- | ------------ |
| indentSize              | `number`                                                  | Size of one indent level (in pixels)                          | `24`         |
| maxIndent               | `number`                                                  | The upper indent limit of any block                           | `8`          |
| minIndent               | `number`                                                  | The lower indent limit of any block                           | `0`          |
| orientation             | `'horizontal' \| 'vertical'`                              | The UI design for how you want the toolbox to be displayed    | `horizontal` |
| customBlockIndentLimits | `Record<string, Partial<Record<'min' \| 'max', number>>>` | A set of overrides of the indent limit for each type of block | `{}`         |
| multiblock              | `boolean`                                                 | If you can indent multiple blocks at a time                   | `false`      |
| tuneName                | `string \| null`                                          | This is required for multiblock to work                       | `null`       |
