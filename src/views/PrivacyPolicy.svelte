<script>
    import { onMount } from 'svelte'
    import { view, hasReadPrivacyPolicy } from '../lib/state'
    import PerfectScrollbar from 'perfect-scrollbar'

    import Button from '../components/Button'
    import Footer from '../components/Footer'

    let container

    let endReached = false

    const onContinue = () => {
        hasReadPrivacyPolicy.set(true)
        view.set('intro')
    }

    onMount(() => {
        new PerfectScrollbar(container)

        container.addEventListener('ps-y-reach-end', () => {
            endReached = true
        })
    })
</script>

<style>
    article {
        position: relative;
        height: calc(100vh - 260px);
        width: 640px;
        padding: 0 30px;
        overflow: hidden;
    }
    :global(.ps__rail-y) {
        display: block;
        position: absolute;
        top: 0px;
        left: auto !important;
        right: 7px;
        opacity: 1;
        width: 6px;
        border-radius: 6px;
        transition: opacity 200ms cubic-bezier(0.55, 0, 0.1, 1);
    }
    :global(.ps__thumb-y) {
        cursor: pointer;
        border-radius: 6px;
        background: #ccc;
        position: absolute;
        left: 0px;
        width: 6px;
    }
    h1,
    h2 {
        font-weight: 600;
    }
    h1 {
        font-size: 28px;
    }
    h2 {
        margin: 30px 0;
    }
</style>

<article bind:this={container}>
    <h1>IOTA Seed Migration Tool - Privacy Policy</h1>
    <h2>General Information</h2>
    <p>
        This privacy policy ("Privacy Policy") describes how the IOTA Foundation (’’IOTA", ’’we’’, ’’us’’, ’’our’’) collects, and
        processes your Personal Data in connection with the usage of the IOTA Seed Migration Tool (“Migration Tool).
    </p>
    <p>
        This Privacy Policy is dedicated to users of the Migration Tool. If you would like to know more about how IOTA processes
        Personal Data (as defined below) that is collected and processed in connection with other services and activities of IOTA,
        please see IOTA’s general
        <a href="https://www.iota.org/research/privacy-policy">Privacy Policy</a>
        .
    </p>
    <p>
        Please read this Privacy Policy carefully to get a clear understanding of how we handle your Personal Data when collected
        through the Migration Tool.
    </p>
    <h2>What is Personal Data</h2>
    <p>
        “Personal Data” means any information relating to an identified or identifiable natural person (‘data subject’); an
        identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an
        identifier such as a name, an identification number, location data, an online identifier or to one or more factors
        specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person.
    </p>
    <h2>How we collect Personal Data</h2>
    <p>
        If you install and use the Migration Tool on your device, the IOTA Foundation may collect and process Personal Data
        required for the operation of the Migration Tool and management and fulfillment of the Migration Tool services.
    </p>
    <p>&nbsp;</p>
    <p>Further, the IOTA Foundation may collect and process Personal Data like your email address or phone number when:</p>
    <ul>
        <li>you contact IOTA, or request that IOTA contacts you, for any reason, or</li>
        <li>you submit your Personal Data to IOTA for any reason.</li>
    </ul>
    <h2>Which Personal Data do we collect</h2>
    <p>It is crucial to note that private keys of the users are never transmitted to the IOTA Foundation.</p>
    <p>We may collect your IP-address to ensure the proper usage of the Migration Tool.</p>
    <h2>Purpose of processing of Personal Data</h2>
    <p>
        We process the Personal Data in order to enable the operation and safe use of the Migration Tool as well as for the
        administration and management of the Migration Tool and the services offered via it. We process Personal Data to ensure no
        misuse of the Migration Tool takes place.
    </p>
    <h2>Lawful basis for processing of Personal Data</h2>
    <p>
        In processing your Personal Data in connection with the purposes set out in this Privacy Policy, we have a legitimate
        interest in carrying out the processing for the purpose of managing, operating or promoting our business, and that
        legitimate interest is not overridden by your interests, fundamental rights, or freedoms.
    </p>
    <h2>Use of cookies</h2>
    <p>We do not use cookies in the Migration Tool.</p>
    <h2>How we protect and store Personal Data</h2>
    <p>
        We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk,
        including inter alia as appropriate:
    </p>
    <ul>
        <li>pseudonymization and encryption of Personal Data;</li>
        <li>
            the ability to ensure the ongoing confidentiality, integrity, availability, and resilience of processing systems and
            services;
        </li>
        <li>
            the ability to restore the availability and access to Personal Data in a timely manner in the event of a physical or
            technical incident;
        </li>
        <li>
            a process for regular testing, assessing and evaluating the effectiveness of technical and organizational measures for
            ensuring the security of the processing.
        </li>
    </ul>
    <p>
        In assessing the appropriate level of security account shall be taken in particular of the risks that are presented by
        processing, in particular from accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access
        to Personal Data transmitted, stored or otherwise processed.
    </p>
    <h2>How we share and disclose Personal Data</h2>
    <p>
        In order to properly operate the Migration Tool and to be able to provide you the services offered via the Migration Tool,
        we may share your Personal Data in the following way:
    </p>
    <h3>Providers of Operating Systems and Telecommunication Services</h3>
    <p>
        Any transmission of data from your device depends on the operating system, the telecommunication network provider as well
        as other providers of data communication (e.g. Wi-Fi provider) used. Please observe the data protection notices of these
        companies.
    </p>
    <h3>Data Processors</h3>
    <p>
        We may use further data processors during the operation of the Migration Tool. When we are involving data processors into
        the performance of our services and contractual obligations and such involvement requires the sharing of Personal Data, we
        have entered with the data processors into data processing agreements according to Art. 28 of the European General Data
        Protection Regulation 2016/679 (“GDPR”) and, as far as required, further appropriate safeguards according to Art. 46-49
        GDPR. The list of actual data processors to which we disclose your Personal Data can be requested by e-mail to
        privacy@iota.org.
    </p>
    <p>
        Please note that IOTA may collect your Personal Data directly from the country where you are based and store it on servers
        in Europe and the United States of America. For the USA there does not exist an adequacy decision by the European
        Commission, guaranteeing an adequate data privacy level. Therefore IOTA has implemented appropriate safeguards to protect
        your Personal Data in the USA. A copy of the safeguards may be obtained by e-mail to privacy@iota.org
    </p>
    <h2>Consent and withdrawal</h2>
    <p>
        Any consent is provided freely. If you give your consent, you have the right to withdraw your consent at any time. The
        withdrawal of consent does not affect the lawfulness of processing based on consent before its withdrawal. After your
        withdrawal we will stop processing your Personal Data, including storage, unless further data processing is required and
        legally permitted. This paragraph is only relevant for processing that is entirely voluntary – it does not apply for
        processing that is necessary or obligatory in any way, as is for example the case with regard to Personal Data required
        for the installation and the operation of the Migration Tool.
    </p>
    <p>
        To withdraw your consent, please send us an e-mail to privacy@iota.org or a letter to IOTA Foundation, c/o Nextland,
        Strassburgerstr. 55, 10405 Berlin.
    </p>
    <h2>Legitimate Interest and Right to Object</h2>
    <p>
        You may object to the processing of your personal data based on legitimate interests of the IOTA Foundation or third
        parties. Unless your objection is directed solely against direct marketing by the IOTA Foundation, you have to explain
        your special situation, which makes the processing of your personal data based on legitimate interests unacceptable for
        you.
    </p>
    <p>
        To object, please send us an e-mail to privacy@iota.org or a letter to IOTA Foundation, c/o Nextland, Strassburgerstr. 55,
        10405 Berlin.
    </p>
    <h2>When we erase your Personal Data</h2>
    <p>
        We erase your Personal Data automatically when they are no longer required for the purposes listed above. We also erase
        your Personal Data according to your request and if further storage is neither required nor permitted by applicable laws.
        Further storage only occurs as long as and as far as it is designated by the EU or Member States legislation in EU Acts,
        Law, or other regulations, that the IOTA Foundation is subject to (e.g. transactional data may be stored for a period of
        10 years).
    </p>
    <h2>Your rights related to data privacy</h2>
    <p>
        You have the right to request access to and rectification or erasure of your Personal Data, or restriction of their
        processing. Furthermore, you have the right to request data portability. If you are in the EU you have the right to file a
        complaint to the relevant data protection authority, e.g. the Berlin Data Protection Authority (Berliner Beauftragte für
        Datenschutz und Informationsfreiheit).
    </p>
    <p>
        You have the right to obtain from us the information as to whether Personal Data concerning you are being processed, the
        purpose of the processing and the categories of Personal Data concerned.
    </p>
    <p>A copy of the Personal Data undergoing processing can be requested.</p>
    <h2>Our contact information, data controller</h2>
    <p>For any requests, you can contact us as follows:</p>
    <p>IOTA Foundation, c/o Nextland, Strassburgerstr. 55, 10405 Berlin.</p>
    <p>privacy@iota.org</p>
    <p>You can contact our data privacy officer as follows:</p>
    <p>privacy@iota.org</p>
    <h2>Changes to the Privacy Policy</h2>
    <p>
        This Privacy Policy may be amended or updated from time to time to reflect changes in our practices with respect to the
        processing of Personal Data, or changes in applicable law. We encourage you to read this Privacy Policy carefully and to
        regularly check this page to review any changes we might make in accordance with the terms of this Privacy Policy. Your
        continued use of our services or website constitutes your agreement to be bound by this Privacy Policy, as amended or
        updated from time to time.
    </p>
    <h2>Questions</h2>
    <p>If you have any questions regarding this Privacy Policy, please contact us at privacy@iota.org.</p>
</article>

<Footer skipCancel>
    <Button disabled={!endReached} onClick={onContinue}>
        {#if !endReached}Please read the full text{:else}Accept and continue{/if}
    </Button>
</Footer>
