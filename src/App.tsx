import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
  Avatar,
  Card,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "aws-amplify/auth";

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [userProfile, setUserProfile] = useState<FetchUserAttributesOutput>();

  const fetchUserProfile = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log("User attributes:", userAttributes);
      setUserProfile(userAttributes);
    } catch (error) {
      console.error("Error fetching user attributes:", error);
    }
  };

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    fetchUserProfile();
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      <Grid
        columnGap="0.5rem"
        rowGap="0.5rem"
        templateColumns="1fr 1fr 1fr"
        templateRows="10vh 3fr 10vh"
        minHeight="100vh"
        width="100vw"
      >
        <Card columnStart="1" columnEnd="-1">
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            padding="1rem"
            height="100%"
          >
            <Flex direction="row" alignItems="center" gap="1rem">
              <Image
                alt="Task Manager Pro Logo"
                src="./logo.svg"
                height="40px"
              />
              <Heading level={2}>Task Manager Pro</Heading>
            </Flex>
            <Flex direction="row" alignItems="center" gap="1rem">
              <Text>Welcome, {userProfile?.preferred_username || "User"}</Text>
              <Avatar
                src={userProfile?.picture || undefined}
                alt={userProfile?.preferred_username || "User avatar"}
              />
            </Flex>
          </Flex>
        </Card>
        <Card columnStart="1" columnEnd="2">
          Nav
        </Card>
        <Card columnStart="2" columnEnd="-1">
          <h1>{userProfile?.preferred_username}'s todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
                {todo.content}
              </li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Deploy #1
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div>
          <button onClick={signOut}>Sign out</button>
        </Card>
        <Card columnStart="1" columnEnd="-1">
          Footer
        </Card>
      </Grid>
    </main>
  );
}

export default App;
