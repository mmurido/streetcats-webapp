import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isResultsPanelVisible: false,
    headerOffset: 0,
    panelOffset: 0,
  }),

  getters: {
    mapPadding: (state) => ({
      top: state.headerOffset,
      left: state.isResultsPanelVisible ? state.panelOffset : 0,
      bottom: 0,
      right: 0,
    }),
  },

  actions: {
    setHeaderOffset(offset: number) {
      this.headerOffset = offset
    },
    setPanelOffset(width: number) {
      this.panelOffset = width
    },
    toggleResultsPanel() {
      this.isResultsPanelVisible = !this.isResultsPanelVisible
    },
  },
})
