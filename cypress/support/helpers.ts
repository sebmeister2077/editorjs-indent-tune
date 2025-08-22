export function getClassSelectorForBlockType(blockType: string) {
    switch (blockType) {
        case 'paragraph':
            return ".ce-paragraph";
        case 'header':
            return '.ce-header'
    }
}

export function isVersionWithPointerEventsNone(version: string) {
    return version >= "2.27"
}
