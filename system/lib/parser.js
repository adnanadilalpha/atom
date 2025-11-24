const fs = require('fs');
const path = require('path');

function extractBlock(source, startKeyword) {
    const keywordIndex = source.indexOf(startKeyword);
    if (keywordIndex === -1) return { extracted: null, clean: source };
    const openBraceIndex = source.indexOf('{', keywordIndex);
    if (openBraceIndex === -1) return { extracted: null, clean: source };
    let braceCount = 1;
    let i = openBraceIndex + 1;
    while (braceCount > 0 && i < source.length) {
        if (source[i] === '{') braceCount++;
        else if (source[i] === '}') braceCount--;
        i++;
    }
    const content = source.substring(openBraceIndex + 1, i - 1);
    const before = source.substring(0, keywordIndex);
    const after = source.substring(i);
    const clean = before + '// Block Extracted ' + after;
    return { extracted: content, clean: clean };
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            if (file.endsWith('.atom')) arrayOfFiles.push(path.join(dirPath, file));
        }
    });
    return arrayOfFiles;
}

module.exports = { extractBlock, getAllFiles };