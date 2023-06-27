import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";

import Form from "./Components/Form";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <h1> Form: </h1>
        </Layout.Section>
        <Layout.Section>
          <Form/>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
