export default function ({ store, redirect }) {
    // If there is a current Cloud selected
    if (!store.state.cloud.currentCloud) {
      return redirect('/addcloud')
    }
}