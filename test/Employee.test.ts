import { XDate } from '../src/XDate'
import { Employee } from '../src/Employee'

describe('Employee', () => {

    it('is birthday', () => {
        const employee = new Employee('foo', 'bar', '1990/01/31', 'a@b.c')

        expect(employee.isBirthday(new XDate('2008/01/30'))).toBeFalsy()
        expect(employee.isBirthday(new XDate('2008/01/31'))).toBeTruthy()
    })

    it('is equal', () => {
        const base = new Employee('First', 'Last', '1999/09/01', 'first@last.com')
        const same = new Employee('First', 'Last', '1999/09/01', 'first@last.com')
        const different = new Employee('First', 'Last', '1999/09/01', 'boom@boom.com')

        expect(base.equals({})).toBeFalsy()
        expect(base.equals(same)).toBeTruthy()
        expect(base.equals(different)).toBeFalsy()
    })
})
