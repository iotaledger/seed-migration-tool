<script>
    import { view } from '../lib/state'

    import Info from '../components/Info.svelte'
    import Footer from '../components/Footer.svelte'
    import Checkbox from '../components/Checkbox.svelte'
    import Button from '../components/Button.svelte'

    let checked = false

    const onClick = () => {
        if (checked) {
            view.set('loading/import')
        }
    }

    const onCheckbox = () => {
        checked = !checked
    }
</script>

<style>
    div {
        padding: 10px 0px 10px 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        -webkit-user-select: none;
    }
    span {
        display: flex;
        flex: 1;
    }

    section {
        display: flex;
        flex-direction: column;
        max-width: 530px;
        margin: 0 auto;
    }
</style>

<section>
    <h1>Migrate your seed only once</h1>

    <Info warning={!checked} success={checked}>
        <div>
            <Checkbox {checked} {onCheckbox} />
            <span>Check the box to confirm that this seed has not already been migrated (e.g. on another device)</span>
            <div />
        </div>
    </Info>
</section>

<Footer back previousScreen="import">
    <Button {onClick} disabled={!checked}>Done</Button>
</Footer>
