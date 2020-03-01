<script>
    import { view, resetState } from '../lib/state'

    import Button from '../components/Button.svelte'
    import Info from '../components/Info.svelte'
    import Footer from '../components/Footer.svelte'

    let password = ''

    const onClick = () => {
        view.set('status')
        resetState()
    }
</script>

<h1>Migration Successful</h1>
<h2>Your IOTA tokens have been migrated. You can now import your new seed into Trinity.</h2>

<Info success left>
    <strong>Your tokens will only become visible on your new seed once the network resumes full operation.</strong>
    <br/>
    <br/>
    If you have additional seeds you would like to migrate, repeat this process again.
    <br/>
    <br/>
    For the latest updates, you can:
    <br/>
    <ul>
        <li>Follow <a href='https://status.iota.org'>the official IOTA status page</a></li>
        <li>Visit our <a href='https://discord.iota.org'>Discord Channel</a></li>
    </ul>
</Info>

<Footer>
    <Button {onClick}>Done</Button>
</Footer>
