import { builder } from './builder';

// Importing all types and resolvers
import './model/todo';

// Crete an Schema to insert into ApolloServer
export const schema = builder.toSchema({});
