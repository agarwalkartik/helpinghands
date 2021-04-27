import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import Layout from "../components/layout";
import AccessDenied from "../components/access-denied";
import Form from "../components/Form";
import { Header, Button } from "semantic-ui-react";

export default function Page() {
  const [session, loading] = useSession();
  const [content, setContent] = useState();

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  // If session exists, display content

  return (
    <Layout>
      <Header>
        Search Posts
        <Button as="a" href="/" floated="right" primary>
          Listing
        </Button>
      </Header>
      <p>{/* <strong>{content || "\u00a0"}</strong> */}</p>
      <Form formId="add-form" />
    </Layout>
  );
}
