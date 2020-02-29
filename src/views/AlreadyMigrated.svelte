<script>
    import { view } from '../lib/state'

    import Button from '../components/Button.svelte'
    import Info from '../components/Info.svelte'
    import Footer from '../components/Footer.svelte'

    const onContinue = () => {
        view.set('balance')
    }
</script>

<h1>Seed already migrated</h1>
<h2>This seed is registered in your migration logs</h2>
<Info warning center>
    <strong>Seeds should not be migrated more than once.</strong>
    <br/>
    <br/>
    For further help, join our <a href="https://discord.iota.org">Discord channel</a>.
</Info>

<Footer cancel/>
