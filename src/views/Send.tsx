import React from "react";
import { useMatomo } from '@datapunt/matomo-tracker-react'
import {
  Layout,
  ChainSelection,
  CoinSelection,
  AddressSelection,
  SendAction,
} from "components";

const Send: React.FC = () => {
  const { trackPageView, trackEvent } = useMatomo()

  // Track page views of the Send tab
  React.useEffect(() => {
    trackPageView()
  }, [])

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
