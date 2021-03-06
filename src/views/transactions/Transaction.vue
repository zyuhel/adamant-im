<template>
  <component :is="transactionComponent" :id="txId" :crypto="crypto" />
</template>

<script>
import AdmTransaction from '../../components/transactions/AdmTransaction.vue'
import EthTransaction from '../../components/transactions/EthTransaction.vue'
import Erc20Transaction from '../../components/transactions/Erc20Transaction.vue'
import BtcTransaction from '../../components/transactions/BtcTransaction.vue'
import LskTransaction from '../../components/transactions/LskTransaction.vue'

import { Cryptos, isErc20, isBtcBased, isLskBased } from '../../lib/constants'
import { getTxUpdateInterval } from '../../lib/transactionsFetching'

export default {
  name: 'transaction',
  props: {
    crypto: {
      required: true,
      type: String
    },
    txId: {
      required: true,
      type: String
    }
  },
  components: {
    AdmTransaction,
    EthTransaction,
    Erc20Transaction,
    BtcTransaction,
    LskTransaction
  },
  mounted () {
    this.update()
    window.clearInterval(this.timer)
    this.timer = window.setInterval(() => this.update(), getTxUpdateInterval(this.crypto))
  },
  beforeDestroy () {
    window.clearInterval(this.timer)
  },
  methods: {
    update () {
      // Regularly update Tx details with confirmations count, do force — fetch details for existing Tx also
      this.$store.dispatch(this.crypto.toLowerCase() + '/updateTransaction', { hash: this.txId, force: true, updateOnly: true })
    }
  },
  computed: {
    transactionComponent () {
      if (this.crypto === Cryptos.ETH) return 'eth-transaction'
      if (isErc20(this.crypto)) return 'erc20-transaction'
      if (isBtcBased(this.crypto)) return 'btc-transaction'
      if (isLskBased(this.crypto)) return 'lsk-transaction'
      return 'adm-transaction'
    }
  },
  data () {
    return {
      timer: null
    }
  }
}
</script>
