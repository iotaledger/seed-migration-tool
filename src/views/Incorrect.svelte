<script>
    import Button from '../components/Button.svelte'
    import Info from '../components/Info.svelte'
    import Input from '../components/Input.svelte'
    import Footer from '../components/Footer.svelte'

    const onClick = () => {
        window.location = 'https://docs.google.com/forms/d/e/1FAIpQLSeVm8JBFhjNACfStDDxpNFOTi-xrJOblOPSOBZmOYg1u0jOEg/viewform?usp=sf_link'
    }
</script>

<h1>My balance isn’t correct</h1>
<h2>If something is wrong, we would like to hear from you</h2>

<Info left>
    We will need to ask you a few questions in order to help investigate your problem.
    <br />
    <br />
    <ul>
        <li>Complete a <a href="https://docs.google.com/forms/d/e/1FAIpQLSeVm8JBFhjNACfStDDxpNFOTi-xrJOblOPSOBZmOYg1u0jOEg/viewform?usp=sf_link">raised issue form</a></li>
        <li>Seek help on the <a href="https://discord.iota.org">IOTA Discord</a></li>
    </ul>
</Info>

<Footer back previousScreen='balance'>
    <Button {onClick}>Raise an issue</Button>
</Footer>
