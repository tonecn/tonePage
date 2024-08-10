class _Logger{
    constructor(){

    }
    
    formatTime(): string{
        let date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    info(msg: string){
        console.log(`[${this.formatTime()}][INFO] ${msg}`);
    }

    warn(msg: string){
        console.log(`[${this.formatTime()}][WARN] ${msg}`);
    }

    error(msg: string){
        console.log(`[${this.formatTime()}][ERROR] ${msg}`);
    }
}
let Logger = new _Logger();
export default Logger;