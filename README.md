# EditorJS Indent Tune

Indentation support for [Editor.js](https://editorjs.io) blocks.

`editorjs-indent-tune` adds **indent** / **unindent controls**, keyboard shortcuts, auto-indent, visual highlighting, RTL/LTR support, and optional multi-block indentation.

![example](./assets/example1.gif)

## Instalation

### NPM

```shell
npm i editorjs-indent-tune
```

### CDN

Require this script on a page with Editor.js.

```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-indent-tune/dist/bundle.js"><script>
```

## Basic Usage

```js
import EditorJS from '@editorjs/editorjs'
import IndentTune from 'editorjs-indent-tune'

const editor = new EditorJS({
    tools: {
        indentTune: {
                class: IndentTune,
                // Recommended: pass Editor.js version for style & older compatibility
                version: EditorJS.version,
            },
    },
     // Apply indent tune globally
    tunes: ['indentTune'],
})
```

That’s it 🎉
No extra configuration is required — all other options are **fully optional** and can be added later as needed.

### What This Does

- Enables indent / unindent controls
- Adds keyboard shortcuts (Tab / Shift + Tab)
- Works for all blocks by default
- Respects built-in indent limits

## Enable / Disable Per Block

If you **don’t** want indentation for a specific block, simply omit the tune from that block’s `tunes` list.

```js
const editor = new EditorJS({
    tools: {
        paragraph: {
            class: Paragraph,
            tunes: [
                // intentionally no indentTune
            ],
        },
    },
})
```

## Highlight Indent Level

You can visually highlight the indent area when a block is focused.

### CSS

```css
.indentHighlight {
    transition: background-color 0.4s ease;
}
[data-block-indent-wrapper][data-focused] .indentHighlight {
    background-color: rgba(255, 0, 0, 0.1);
}
```

### Config

```js
const editor = new EditorJS({
    tools: {
        indentTune: {
            class: IndentTune,
            config: {
                highlightIndent: {
                    className: 'indentHighlight',
                },
            },
        },
    },
})
```

## Complete Example (TypeScript)

```js
import EditorJS from '@editorjs/editorjs'
import IndentTune, { type IndentTuneConfig } from 'editorjs-indent-tune'

const editor = new EditorJS({
    tools: {
        paragraph: {
            class: Paragraph,
        },
        indentTune: {
            class: IndentTune,
            config: {
                version: EditorJS.version,

                indentSize: 30,
                maxIndent: 10,
                minIndent: 0,

                multiblock: true,
                tuneName: 'indentTune',

                customBlockIndentLimits: {
                paragraph: { max: 5 },
                },
            } as IndentTuneConfig,
        },
    },
})
```

## Keyboard Shortcuts

By default, **EditorJS Indent Tune** enables keyboard-based indentation.

### Default Behavior

| Shortcut | Action |
|-|-|
| `Tab` | Indent block |
| `Shift + Tab` | Unindent block |

✅ Works on the currently focused block

✅ Supports multi-block selection if multiblock is enabled

✅ Automatically respects minIndent / maxIndent limits

### Custom Keyboard Handling

You can override the default keyboard behavior using the `handleShortcut` option.

```ts
handleShortcut?: (
  e: KeyboardEvent,
  blockId: string
) => 'indent' | 'unindent' | 'default' | void
```

#### Interpretation

| Return value | Effect |
|-|-|
| `'indent'` | Forces indentation |
| `'unindent'` | Forces un-indentation |
| `'default'` | Uses built-in behavior |
| `undefined` | Uses build-in behavior |
| `false` (as config value) | Disabled shortcuts completely |

#### Example: Custom Shortcut Logic

```ts
const editor = new EditorJS({
  tools: {
    indentTune: {
      class: IndentTune,
      config: {
        handleShortcut(e, blockId) {
          // Use Ctrl + ] / Ctrl + [
          if (e.ctrlKey && e.key === ']') return 'indent'
          if (e.ctrlKey && e.key === '[') return 'unindent'

          return 'default'
        },
      },
    },
  },
})
```

#### Notes

- Auto-indent and keyboard indent respect block-specific limits
- Direction (ltr / rtl) does not affect shortcut logic — only visual placement

### Using With an Alignment Tune (RTL / LTR)

If your editor also supports **text alignment**, you may want indentation to react to direction changes (LTR ↔ RTL).
This can be done using `directionChangeHandler`.

### Example Alignment Tune

```ts
class MyAlignmentTune {
  private block

  constructor({ block }) {
    this.block = block
  }

  private static listeners = new Set<
    (blockId: string, direction: 'ltr' | 'rtl') => void
  >()

  static addChangeListener(
    listener: (blockId: string, direction: 'ltr' | 'rtl') => void
  ) {
    MyAlignmentTune.listeners.add(listener)
  }

  private onChange(alignment: 'left' | 'right') {
    const direction = alignment === 'left' ? 'ltr' : 'rtl'
    MyAlignmentTune.listeners.forEach(l =>
      l(this.block.id, direction)
    )
  }

  wrap(blockContent: HTMLElement) {
    const direction = this.data.alignment === 'left' ? 'ltr' : 'rtl'
    MyAlignmentTune.listeners.forEach(l =>
      l(this.block.id, direction)
    )
    return blockContent
  }
}
```

### Editor Setup

```js

const editor = new EditorJS({
    tools: {
        alignmentTune: {
            class: MyAlignmentTune,
        },
        indentTune: {
            class: IndentTune,
            config: {
                directionChangeHandler: MyAlignmentTune.addChangeListener,
            },
        },
    },
})
```

✅ You’re free to implement this however you prefer — this is just one approach.

## Selecting Indent Elements (DOM)

These static constants are exposed for easier quering:

```ts
IndentTune.DATA_WRAPPER_NAME
IndentTune.DATA_FOCUSED
IndentTune.DATA_INDENT_LEVEL

```

### Examples

```ts
// Wrapper
document.querySelector(`[${IndentTune.DATA_WRAPPER_NAME}]`)

// Focused wrapper
document.querySelector(`[${IndentTune.DATA_FOCUSED}]`)

// Indent level
element.getAttribute(IndentTune.DATA_INDENT_LEVEL)

```

## Configuration Options

All config fields are optional.

| Field                   | Type                                                                                                       | Description                                                                                                                                                                                                                                                               | Default      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| version | `string` | Recommended to pass editor version for seamless style adjustments | `2.29` |
| indentSize              | `number`                                                                                                   | Size of one indent level (in pixels)                                                                                                                                                                                                                                      | `24`         |
| maxIndent               | `number`                                                                                                   | The upper indent limit of any block                                                                                                                                                                                                                                       | `8`          |
| minIndent               | `number`                                                                                                   | The lower indent limit of any block                                                                                                                                                                                                                                       | `0`          |
| orientation             | `'horizontal' \| 'vertical'`                                                                               | The UI design for how you want the toolbox to be displayed                                                                                                                                                                                                                | `horizontal` |
| customBlockIndentLimits | `Record<string, Partial<Record<'min' \| 'max', number>>>`                                                  | A set of overrides of the indent limit for each type of block                                                                                                                                                                                                             | `{}`         |
| multiblock              | `boolean`                                                                                                  | Marks if you can indent multiple blocks at a time                                                                                                                                                                                                                         | `false`      |
| tuneName                | `string \| null`                                                                                           | This is required for multiblock to work                                                                                                                                                                                                                                   | `null`       |
| handleShortcut          | `((e:KeyboardEvent, blockId:string) => 'unindent' \| 'indent' \| 'default' \| void) \| undefined \| false` | Custom shortcut function that allows overriding the default indenting using keyboard. If set as `false` no shortcut will be applied.                                                                                                                                      | `undefined`  |
| direction               | `'ltr' \| 'rtl'`                                                                                          | Specify the global direction of the indents                                                                                                                                                                                                                               | `ltr`        |
| directionChangeHandler  | `null \| (listener: (blockId: string, direction: TextDirection) => void): void`                            | If provided will be used to apply visual changes (indent direction) based on the provided change value.                                                                                                                                                                   | `null`       |
| highlightIndent         | `null \| { className?: string; tuneNames?: string[]; }`                                                    | If provided will display a highlight for the indent. Provide a list of `tuneNames` for which it should be applied, applies to all by default. Can be customized with custom class using `[data-focused] .myClass {}`                                                      | `null`       |
| autoIndent              | `null \| boolean \| {  tuneNames?: string[]; }`                                                            | If provided with a config object or `true` will automatically indent new blocks to same level as the previous block, if there are no indentation limit restrictions. Provide a list of `tuneNames` for which block types it should be applied, applies to all by default. | `false`      |
