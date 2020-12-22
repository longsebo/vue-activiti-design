function  getRandomInt(min, max) {
    // 以下函数返回 min（包含）～ max（包含）之间的数字：
    return Math.floor(Math.random() * (max - min + 1)) + min
}
export default{
 getRandomInt
}
