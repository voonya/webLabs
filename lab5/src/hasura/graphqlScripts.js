import { get } from 'svelte/store';
import { token } from '../lib/store';

const queriesDoc = `
  mutation addNote($title: String, $text: String) {
    insert_lab5_notes_one(object: {title: $title, text: $text}) {
      id
      date
    }
  }
  mutation updateLike($id: uuid!, $liked: Boolean) {
    update_lab5_notes_by_pk (
      pk_columns: {id: $id}
      _set: { liked: $liked }
      ) {
      id
    }
  }
  mutation deleteNote($id: uuid!) {
    delete_lab5_notes_by_pk (
      id: $id
    ) {
      id
    }
  }
  mutation editNote($id: uuid!, $title: String, $text: String) {
    update_lab5_notes_by_pk (
      pk_columns: {id: $id}
      _set: { text: $text title: $title }
      ) {
      id
      }
    }
  query loadNotes {
    lab5_notes(order_by: {time: desc}) {
      date
      id
      liked
      text
      title
    }
  }
`;

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(import.meta.env.VITE_API_HTTPS_ENDPOINT_LAB5, {
    headers: {
      Authorization: `Bearer ${get(token)}`,
    },
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

function fetchMyQuery(request, variables) {
  return fetchGraphQL(queriesDoc, request, variables);
}

export async function startFetchMyQuery(request, variables) {
  const { errors, data } = await fetchMyQuery(request, variables);

  if (errors) {
    return errors;
  }
  return data;
}
