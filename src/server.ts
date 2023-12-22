import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema';

const port = Number(process.env.PORT) || 4000;

const startApolloServer = async () => {
	const server = new ApolloServer({
		schema,
	});
	const { url } = await startStandaloneServer(server, {
		listen: { port },
	});

	console.info(`
    Server is running!
    Query at ${url}
    `);
};

startApolloServer();
