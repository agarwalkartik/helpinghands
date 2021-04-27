import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Menu,
  Segment,
  Step,
  Table,
} from "semantic-ui-react";
import styles from "./header.module.css";

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function AppHeader() {
  const [session, loading] = useSession();

  return (
    // <Header>
    // <noscript>
    //   <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
    // </noscript>
    <Menu stackable>
      <Menu.Item>
        <img src="/logo.png" />
      </Menu.Item>
      <Menu.Item name="home">
        <Link href="/">
          <a>Home</a>
        </Link>
      </Menu.Item>
      <Menu.Item name="search">
        <Link href="/">
          <a>About</a>
        </Link>
      </Menu.Item>
      {/* <Menu.Item position="right" name="post">
          <Button primary>New Post</Button> */}
      {/* <Link href="/post">
            <a>Add a new post</a>
          </Link> */}
      {/* </Menu.Item> */}

      {!session && (
        <Menu.Item position="right">
          <Button
            color="google plus"
            className={styles.buttonPrimary}
            onClick={(e) => {
              signIn("google");
            }}
          >
            <Icon name="google plus" />
            Sign in
          </Button>
        </Menu.Item>
      )}

      {session && (
        <Menu.Item position="right">
          <div>
            {session.user.image && <Image src={session.user.image} avatar />}
            {/* <span>{session.user.email || session.user.name}</span> */}
          </div>
          <a
            href={`/api/auth/signout`}
            className={styles.button}
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign out
          </a>
        </Menu.Item>
      )}
    </Menu>
    // </Header>
  );
}
