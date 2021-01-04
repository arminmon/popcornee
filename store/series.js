export const state = () => ({
  id: null,
  name: null,
})

export const mutations = {
  SET_ID(state, value) {
    state.id = value
  },
  SET_NAME(state, value) {
    state.name = value
  },
}
