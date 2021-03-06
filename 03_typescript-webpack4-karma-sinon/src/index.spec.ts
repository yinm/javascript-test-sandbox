import { CreditCard, Item, Order } from './index'
import * as sinon from 'sinon'

it('spy', () => {
  const item = new Item(100)
  const spy = sinon.spy(item, 'calculateDiscount')

  const order = new Order()
  order.add(item)
  order.add(item)
  order.pay(new Date(), 20)

  expect(spy.withArgs(20).calledTwice).toBe(true)
  expect(order.getPayment()).toBe(160)

  const obj: any = {
    method() {
      console.log('called spy.')
    }
  }
  sinon.spy(obj, 'method')
  obj.method()
})

it('stub', () => {
  const item = new Item()
  const stub = sinon.stub(item, 'calculateDiscount')

  stub.onCall(0).returns(70)
  stub.onCall(1).returns(80)

  const order = new Order()
  order.add(item)
  order.add(item)
  order.pay(new Date(), 20)

  expect(stub.withArgs(20).calledTwice).toBe(true)
  expect(order.getPayment()).toBe(150)

  const obj: any = {
    method() {
      console.log('called stub.')
    }
  }
  sinon.stub(obj, 'method')
  obj.method()
})

it('mock', () => {
  const item = new Item()
  const mock = sinon.mock(item)

  mock.expects('calculateDiscount')
    .twice()
    .withArgs(10)
    .returns(90)

  const order = new Order()
  order.add(item)
  order.add(item)

  order.pay(new Date(), 10)
  mock.verify()

  expect(order.getPayment()).toBe(180)
})

describe('fake', () => {
  let clock: any

  beforeEach(() => {
    clock = sinon.useFakeTimers(1522541700000)
  })

  afterEach(() => {
    clock.restore()
  })

  it('paid', () => {
    const order = new Order()
    order.add(new Item(100))
    order.pay(new Date())

    expect(order.receipt()).toBe('2018/4 100円')
  })
})

it('dummy', () => {
  const item = new Item(100)
  const order = new Order()
  order.add(item)

  const dummyCard: CreditCard = {
    no: '1234-0000-1234-0000',
    kind: 'visa',
  }

  order.payByCreditCard(new Date(), 20, dummyCard)
  expect(order.getPayment()).toBe(80)
})
