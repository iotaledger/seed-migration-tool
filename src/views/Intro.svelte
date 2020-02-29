<script>
    import { view } from '../lib/state'

    import Button from '../components/Button.svelte'
    import Info from '../components/Info.svelte'
    import Footer from '../components/Footer.svelte'

    const onContinue = () => {
        view.set('import')
    }

    const onStatus = () => {
        view.set('status')
    }

    const onHow = () => {
        window.location = "https://docs.iota.org/docs/wallets/0.1/trinity/how-to-guides/protect-trinity-account"
    }
</script>

<h1>Seed Migration</h1>
<h2>Migrate your IOTA to a new seed</h2>
<Info center>
    <strong>
        This tool takes your old seed and transfers all your IOTA tokens to a new, secure seed. Once complete, you can import your new seed into Trinity.
    </strong>
    <br/>
    <br/>
    Seeds can only be migrated <strong>17:00 (UTC) 29th Feb - 17:00 (UTC) 7th March</strong>.
    <br/>
    <br/>
    Your tokens will only become visible on your new seed once the network resumes full operation.
    <Button inline onClick={onHow}>How this works</Button>
    <br/>
    Check <a href='https://status.iota.org'>here</a> for continued updates.
</Info>

<Footer>
    <Button dark onClick={onStatus}>View migration status</Button>
    <Button onClick={onContinue}>Continue</Button>
</Footer>
