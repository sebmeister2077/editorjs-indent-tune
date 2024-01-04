class IndentBlockTune {
    static get isTune() {
        return true
    }

    constructor({ api, data, config, block }) {
        this.api = api
        this.block = block
        this.config = { indentSize: 24, maxIndent: 8, ...(config ?? {}) }
        this.data = { indentLevel: 0, ...(data ?? {}) }
    }

    /**
     * @returns {HTMLElement | TunesMenuConfig}
     */
    render() {
        return [
            {
                title: 'Indent',
                onActivate: () => this.indentBlock(),
            },
            {
                title: 'Un indent',
                onActivate: () => this.unIndentBlock(),
            },
        ]
    }

    /**
     * @param {HTMLElement} pluginsContent
     * @returns {HTMLElement}
     */
    wrap(pluginsContent) {
        this.wrapper = document.createElement('div')
        this.wrapper.appendChild(pluginsContent)
        this.applyIndentToWrapper()

        this.wrapper.addEventListener(
            'keydown',
            (e) => {
                if (e.key !== 'Tab') return

                e.preventDefault()
                e.stopPropagation()

                if (e.shiftKey) this.unIndentBlock()
                else this.indentBlock()
            },
            { capture: true },
        )

        return this.wrapper
    }

    applyIndentToWrapper() {
        this.wrapper.style.paddingLeft = `${this.data.indentLevel * this.config.indentSize}px`
    }

    indentBlock() {
        this.data.indentLevel = Math.min(this.data.indentLevel + 1, this.config.maxIndent)
        this.applyIndentToWrapper()
    }

    unIndentBlock() {
        this.data.indentLevel = Math.min(this.data.indentLevel - 1, 0)
        this.applyIndentToWrapper()
    }

    save() {
        return this.data
    }
}
