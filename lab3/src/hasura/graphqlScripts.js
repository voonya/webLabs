const queriesDoc = `
  mutation addTweet($title: String, $text: String) {
    insert_tweets_one(object: {title: $title, text: $text}) {
      id
      date
    }
  }
  mutation updateLike($id: uuid!, $liked: Boolean) {
    update_tweets_by_pk (
      pk_columns: {id: $id}
      _set: { liked: $liked }
      ) {
      id
    }
  }
  mutation deleteTweet($id: uuid!) {
    delete_tweets_by_pk (
      id: $id
    ) {
      id
    }
  }
  mutation editTweet($id: uuid!, $title: String, $text: String) {
    update_tweets_by_pk (
      pk_columns: {id: $id}
      _set: { text: $text title: $title }
      ) {
      id
      }
    }
  query loadTweets {
		tweets(order_by: {time: desc}) {
			date
			id
			liked
			text
			title
		}
	}
`;

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(import.meta.env.VITE_API_HTTPS_ENDPOINT, {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN,
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
