/**
 * 
 * @param textToCopy 需要被复制的文本
 * @returns 成功返回 true, 不成功返回 false
 */
const copyText = (textToCopy: string): boolean => {
    // 创建一个<textarea>元素，将文本放入其中
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // 将<textarea>元素添加到DOM中
    document.body.appendChild(textArea);
    // 选择<textarea>元素中的文本
    textArea.select();
    let copyStatus = false; // true成功, false失败
    try {
        // 尝试将选定的文本复制到剪贴板
        document.execCommand("copy");
        copyStatus = true;
    } catch (err) {
        console.error("复制文本失败：", err);
    }
    // 从DOM中移除<textarea>元素
    document.body.removeChild(textArea);
    return copyStatus;
}

export default copyText;