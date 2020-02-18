import { OurDate } from './OurDate'

export class Employee {

    private readonly _firstName: string
    private readonly _lastName: string
    private readonly _birthDate: OurDate
    private readonly _email: string

    constructor(firstName: string, lastName: string, birthDate: string, email: string) {
        this._firstName = firstName
        this._lastName = lastName
        this._birthDate = new OurDate(birthDate)
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

    isBirthday(today: OurDate) {
        return today.isSameDay(this._birthDate)
    }

    equals(obj: object) {
        if (!(obj instanceof Employee)) {
            return false
        }

        if (this._birthDate == null) {
            if (this._birthDate != null) {
                return false
            }
        } else if (!this._birthDate.equals(obj._birthDate)) {
            return false
        }
        if (this._email == null) {
            if (obj._email != null) {
                return false
            }
        } else if (this._email !== obj._email) {
            return false
        }
        if (this._firstName == null) {
            if (obj._firstName != null) {
                return false
            }
        } else if (this._firstName !== obj._firstName) {
            return false
        }
        if (this._lastName == null) {
            if (obj._lastName != null) {
                return false
            }
        } else if (this._lastName !== obj._lastName) {
            return false
        }
        return true
    }
}