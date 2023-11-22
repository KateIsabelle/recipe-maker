import Head from 'next/head'
import { useState } from 'react';
import clientPromise from '../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { TextInput, Checkbox, Button, Group, Box, Select, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';

type ConnectionStatus = {
  isConnected: boolean
};

interface FormValues {
  includeOtherIngredients: boolean;
  typeOfFood: string;
  ingredients: string[];
  // [key: string]: string;
};

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const form = useForm<FormValues>({
    initialValues: {
      ingredients: [''],
      includeOtherIngredients: true,
      typeOfFood: 'Any'
    },
  });

  const [ingredients, setIngredients] = useState<string[]>(['ingredients']);

  const addIngredientField = () => {
    setIngredients([...ingredients, `input${ingredients.length + 1}`]);
  };

  return (
    <Box maw={340} mx="auto">
    
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {ingredients.map((ingredient, i) => (
          <Paper key={ingredient} style={{ marginBottom: '16px' }}>
            <TextInput
              name={ingredient}
              label={`Ingredient ${i+1}`}
              value={form.values.ingredients[i]}
              onChange={(event) => form.setFieldValue(ingredient, event.currentTarget.value)}
            />
          </Paper>
      ))}

        <Checkbox
          mt="md"
          label="Include other ingredients that are not on my list"
        />
        <Select
          label="Type of cuisine"
          placeholder="Choose your favourite"
          data={['Any', 'Chinese', 'Greek', 'Indian', 'Italian']}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>

      {isConnected ? (
          <h2 className="subtitle">You are connected to MongoDB</h2>
        ) : (
          <h2 className="subtitle">
            You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
            for instructions.
          </h2>
      )}
    </Box>
  );
};
