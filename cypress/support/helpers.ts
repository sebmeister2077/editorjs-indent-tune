export function getClassSelectorForBlockType(blockType: string) {
    switch (blockType) {
        case 'paragraph':
            return ".ce-paragraph";
        case 'header':
            return '.ce-header'
    }
}