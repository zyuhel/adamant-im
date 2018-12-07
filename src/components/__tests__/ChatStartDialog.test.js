import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'

import mockupI18n from './__mocks__/plugins/i18n'
import mockupSnackbar from './__mocks__/store/modules/snackbar'
import ChatStartDialog from '@/components/ChatStartDialog'

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(Vuetify)

/**
 * Mockup store helper.
 */
function mockupStore () {
  const snackbar = mockupSnackbar()

  const store = new Vuex.Store({
    modules: {
      snackbar
    }
  })

  return {
    store,
    snackbar
  }
}

describe('ChatStartDialog.vue', () => {
  let store = null
  let snackbar = null
  let i18n = null

  beforeEach(() => {
    // mockup Store
    const mockup = mockupStore()
    store = mockup.store
    snackbar = mockup.snackbar // used as reference

    // mockup i18n
    i18n = mockupI18n()
  })

  it('renders the correct markup', () => {
    const wrapper = shallowMount(ChatStartDialog, {
      store,
      i18n,
      propsData: {
        value: true
      }
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should display dialog when :value = true', () => {
    const wrapper = shallowMount(ChatStartDialog, {
      store,
      i18n,
      propsData: {
        value: true
      }
    })

    // show dialog
    expect(wrapper.vm.show).toBe(true)

    // hide dialog
    wrapper.setProps({ value: false })
    expect(wrapper.vm.show).toBe(false)
  })

  it('should show snackbar when invalid recipient address', () => {
    const wrapper = shallowMount(ChatStartDialog, {
      store,
      i18n,
      propsData: {
        value: true
      }
    })

    wrapper.setData({ recipientAddress: 'U123ABC' }) // invalid address
    wrapper.vm.startChat()

    expect(snackbar.actions.show).toHaveBeenCalled()
  })

  it('should emit `start-chat` when valid recipient address', () => {
    const wrapper = shallowMount(ChatStartDialog, {
      store,
      i18n,
      propsData: {
        value: true
      }
    })

    wrapper.setData({ recipientAddress: 'U123456' }) // valid address
    wrapper.vm.startChat()

    expect(wrapper.emitted()['start-chat']).toBeTruthy()
    expect(wrapper.emitted().input).toEqual([[ false ]]) // should close dialog after
  })

  it('should startChat() when onScanQrcode()', () => {
    const wrapper = shallowMount(ChatStartDialog, {
      store,
      i18n,
      propsData: {
        value: true
      }
    })

    // mockup startChat() method
    wrapper.setMethods({
      startChat: jest.fn()
    })

    // should call startChat()
    const recipientAddress = 'U123456'
    wrapper.vm.onScanQrcode(recipientAddress)
    expect(wrapper.vm.startChat).toHaveBeenCalled()

    // should update recipientAddress
    expect(wrapper.vm.recipientAddress).toBe(recipientAddress)
  })
})
