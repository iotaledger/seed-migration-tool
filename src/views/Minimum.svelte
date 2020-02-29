<script>
    import { view } from '../lib/state'
    import Info from '../components/Info.svelte'
    import Button from '../components/Button.svelte'
    import Footer from '../components/Footer.svelte'

    const onClick = () => {
        view.set('balance')
    }
</script>

<h1>Migration is not possible</h1>
<h2>Your account balance must be greater than 1Mi to proceed</h2>

<Info center>
    If you believe that your account balance is incorrect, please return to the previous screen and try scanning for more addresses.
</Info>

<Footer>
    <Button {onClick}>Back</Button>
</Footer>
