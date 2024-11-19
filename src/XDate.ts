export class XDate {

    private _date: Date

    constructor(yyyyMMdd: string) {
        this._date = new Date(yyyyMMdd)
    }

    getDay() {
        return this._date.getDate()
    }

    getMonth() {
        return 1 + this._date.getMonth()
    }

    isSameDay(anotherDate: XDate) {
        return anotherDate.getDay() === this.getDay() && anotherDate.getMonth() === this.getMonth()
    }

    equals(obj: object) {
        return obj instanceof XDate && obj._date.getTime() === this._date.getTime()
    }
}