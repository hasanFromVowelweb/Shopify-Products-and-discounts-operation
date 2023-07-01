import React, { useState, useCallback } from "react";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text, LegacyCard, Tabs,
} from "@shopify/polaris";

import Form from "./Components/Form";
import Table from "./Components/Table";
import ProductsTable from "./Components/ProductsTable";


export default function HomePage() {
  const [data, setData] = useState('');
  const [selected, setSelected] = useState(0);


  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'all-customers-1',
      content: 'Form',
      title: 'Discount Form',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
      component: <Form receivedData={data} resetEditData={setData}/>
    },
    {
      id: 'accepts-marketing-1',
      content: 'Table',
      title: 'Discount Table',
      panelID: 'accepts-marketing-content-1',
      component:<Table sendData={setData} updateTabs={setSelected}/>
    },
    {
      id: 'product-table-1',
      content: 'Product',
      title: 'Products Table',
      panelID: 'accepts-marketing-content-1',
      component:<ProductsTable />
    },
  ];


  return (
    <Page narrowWidth>
      <Layout>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <LegacyCard.Section title={tabs[selected].title}>
            <div className="my-5 container">
            {tabs[selected].component}
            </div>
          </LegacyCard.Section>
        </Tabs>
      </Layout>
    </Page>
  );
}
