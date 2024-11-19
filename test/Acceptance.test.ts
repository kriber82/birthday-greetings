import { XDate } from '../src/XDate'
import { BirthdayService } from '../src/BirthdayService'
import { messagesSent, startMailhog, stopMailHog } from './mailhog'
import flushPromises from 'flush-promises'

describe('Acceptance', () => {

    const SMTP_PORT = 1025
    const SMTP_URL = '127.0.0.1'
    let service: BirthdayService

    beforeEach(() => {
        startMailhog()

        service = new BirthdayService()
    })

    afterEach(() => {
        stopMailHog()
    })

    it('base scenario', async () => {
        await service.sendGreetings('employee_data.txt', new XDate('2008/10/08'), SMTP_URL, SMTP_PORT)
        await flushPromises() // TODO still necessary?

        const messages = await messagesSent()
        expect(messages.length).toEqual(1)
        const message = messages[0]
        expect(message.Content.Body).toEqual('Happy Birthday, dear John!')
        expect(message.Content.Headers.Subject[0]).toEqual('Happy Birthday!')
        const tos = message.Content.Headers.To
        expect(tos.length).toEqual(1)
        expect(tos[0]).toEqual('john.doe@foobar.com')
    })

    it('will not send emails when nobodys birthday', async () => {
        await service.sendGreetings('employee_data.txt', new XDate('2008/01/01'), SMTP_URL, SMTP_PORT)
        await flushPromises() // TODO still necessary?

        const messages = await messagesSent()
        expect(messages.length).toEqual(0)
    })
})