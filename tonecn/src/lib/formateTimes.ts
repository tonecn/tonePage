function formateTimes(times: number) {
    if (times < 10000)// 一万以内直接显示
        return times;
    if (times < 10000 * 10000)// 一亿以内加上 万
        return (times / 10000).toFixed(1) + '万'
    return (times / 10000 / 10000).toFixed(1) + '亿'
}

export { formateTimes };