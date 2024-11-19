import { XDate } from './XDate'

export class Employee {

    private readonly _firstName: string
    private readonly _lastName: string
    private readonly _birthDate: XDate
    private readonly _email: string

    constructor(firstName: string, lastName: string, birthDate: string, email: string) {
        this._firstName = firstName
        this._lastName = lastName
        this._birthDate = new XDate(birthDate)
        this._email = email
    }

    getFirstName(): string {
        return this._firstName
    }

    getLastName(): string {
        return this._lastName
    }

    getEmail(): string {
        return this._email
    }

    isBirthday(today: XDate) {
        return today.isSameDay(this._birthDate)
    }

    equals(obj: object) {
        if (!(obj instanceof Employee)) {
            return false
        }

        if (!this._birthDate.equals(obj._birthDate)) {
            return false
        }
        if (this._email !== obj._email) {
            return false
        }
        if (this._firstName !== obj._firstName) {
            return false
        }
        return this._lastName === obj._lastName
    }
}