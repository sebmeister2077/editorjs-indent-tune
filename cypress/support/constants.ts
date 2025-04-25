import { EditorVersions } from "./EditorVersions"

export const TEMP_ENVIRONMENT_URL = 'http://127.0.0.1:5500/local-testing.html'

export const EDITOR_VERSIONS: EditorVersions[keyof EditorVersions][] = [
     "2.18", "2.18.0", '2.19', '2.19.0', '2.19.1', '2.19.2', '2.19.3', '2.20', '2.20.0', '2.20.1', '2.20.2', '2.21', '2.21.0', '2.22', '2.22.0', '2.22.1', '2.22.2', '2.22.3', '2.23', '2.23.0', '2.23.1', '2.23.2', '2.24', '2.24.0', '2.24.1', '2.24.2', '2.24.3', '2.25', '2.25.0', '2.26', "2.26.0", '2.26.1', '2.26.2', '2.26.3', '2.26.4', '2.26.5', '2.27', '2.27.0', '2.27.1', '2.27.2', '2.28', '2.28.0', '2.28.1', '2.28.2',
     '2.29', '2.29.0', '2.29.1', '2.29.2', '2.30', '2.30.1', '2.30.2', '2.30.3', '2.30.4', '2.30.5', '2.30.6', '2.30.7'
]

export const WRAPPER_ATTRIBUTE_NAME = "data-indent-level"

export const EDITOR_CLASSES = {
    ToolbarSettings: "ce-toolbar__settings-btn",
    BaseBlock: "ce-block",
    ToolbarIndentRoot: "ce-popover-indent-item",
} as const;
