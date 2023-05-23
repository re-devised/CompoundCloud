export default async function ({ store, redirect }) {
    await store.dispatch('setting/fetchAdminSettings')
    if (store.state.setting.adminSettings.isSetupMode) {
      console.log("[SETUP MODE]")
      return redirect('/setup')
    }
}