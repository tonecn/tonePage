function timestampToRelativeWeekday(timestamp: string | number) {
    if (timestamp === undefined || timestamp === null) {
        throw new Error('Timestamp cannot be undefined or null');
    }

    const date = new Date(+timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置为今天的零点，以便于比较

    // 判断是否为明天
    const date0000 = new Date(date);
    date0000.setHours(0, 0, 0, 0);
    const isTomorrow = date0000.getTime() === today.getTime() + 24 * 60 * 60 * 1000;
    const isToday = date0000.getTime() === today.getTime();

    // 获取星期几，注意JavaScript的getDay()返回值是0（周日）到6（周六）
    const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];

    if (isToday) {
        return '今天';
    } else if (isTomorrow) {
        return '明天';
    } else {
        return weekday;
    }
}

export { timestampToRelativeWeekday }