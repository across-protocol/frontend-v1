<!-- Matomo -->
<script>
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://across.matomo.cloud/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='//cdn.matomo.cloud/across.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<!-- End Matomo Code -->

import React from "react";
import {
  Layout,
  ChainSelection,
  CoinSelection,
  AddressSelection,
  SendAction,
} from "components";

const Send: React.FC = () => {
  return (
    <Layout>
      <ChainSelection />
      <CoinSelection />
      <AddressSelection />
      <SendAction />
    </Layout>
  );
};

export default Send;
