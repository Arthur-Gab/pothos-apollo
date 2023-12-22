import { builder } from '../builder';
import { GraphQLError } from 'graphql';
import { getNextID } from './util/util';

builder.queryField('getTodoByID', (t) =>
	t.field({
		description: 'Get a todo passing an ID as variable',
		type: Todo,
		args: {
			id: t.arg.int({
				required: true,
			}),
		},
		nullable: true,
		resolve: (_parent, args) => {
			const todo = TODOS.find((todo) => todo.id === args.id);

			if (!todo) {
				throw new GraphQLError(
					`Not founded the todo with ID: '${args.id}'`,
					{
						extensions: {
							code: 'TODO_NOT_FOUND',
						},
					}
				);
			}

			return todo;
		},
	})
);

builder.queryField('getAllTodos', (t) =>
	t.field({
		description:
			'Return a list contain all todos on db, othewise return an empty list',
		type: [Todo],
		nullable: {
			list: false,
			items: true,
		},
		resolve: () => (TODOS.length > 0 ? TODOS : []),
	})
);

builder.mutationField('createTodo', (t) =>
	t.field({
		description: `To CREATE a todo, you must provide at least the field "title", the field "isCompleted" is optional an populated with false if not provided`,
		type: Todo,
		nullable: true,
		args: {
			title: t.arg.string({
				required: true,
			}),
			isCompleted: t.arg.boolean({
				defaultValue: false,
				required: true,
			}),
		},
		resolve: async (_parent, args) => {
			const newTodo = {
				id: getNextID(TODOS),
				title: args.title,
				isCompleted: args.isCompleted,
			};

			TODOS.push(newTodo);

			return newTodo;
		},
	})
);

builder.mutationField('deleteTodoByID', (t) =>
	t.field({
		description: 'To DELETE a todo item, an ID input is required',
		type: Todo,
		args: {
			id: t.arg.int({ required: true }),
		},
		resolve: (_parent, args) => {
			const todoIndex = TODOS.findIndex((item) => item.id === args.id);

			const todoItem = TODOS[todoIndex];

			if (todoIndex === -1) {
				throw new GraphQLError('The provided ID is invalid', {
					extensions: {
						code: 'INVALID_ID',
					},
				});
			}

			TODOS.filter((item) => item.id !== args.id);

			return todoItem;
		},
	})
);

builder.mutationField('updateTodoByID', (t) =>
	t.field({
		description:
			'To UPDATE a todo item, an ID input is required and a field to update',
		type: Todo,
		args: {
			id: t.arg.int({ required: true }),
			title: t.arg.string({ defaultValue: null }),
			isCompleted: t.arg.boolean({ defaultValue: null }),
		},
		resolve: (_parent, args) => {
			// Check if the provided ID are VALID
			const todoIndex: number = TODOS.findIndex(
				(item) => item.id === args.id
			);

			if (todoIndex === -1) {
				throw new GraphQLError('The provided ID is invalid', {
					extensions: {
						code: 'INVALID_ID',
					},
				});
			}

			// Check if any fields are provided for update
			const fieldsToUpdate = Object.keys(args).filter(
				(key) => args[key] !== null
			);

			if (fieldsToUpdate.length === 1) {
				throw new GraphQLError(
					'At least one field should be provided for update',
					{
						extensions: {
							code: 'NO_FIELDS_PROVIDED',
						},
					}
				);
			}

			// Fire null values provided
			const argsWithoutNullish = fieldsToUpdate.reduce((acc, key) => {
				acc[key] = args[key];
				return acc;
			}, {});

			const todoItem = TODOS[todoIndex];

			// Update the todoItem
			Object.assign(todoItem, argsWithoutNullish);

			return todoItem;
		},
	})
);

interface ITodo {
	id: number;
	title: string;
	isCompleted: boolean;
}

const TODOS: ITodo[] = [
	{
		id: 1,
		title: 'Buy groceries',
		isCompleted: false,
	},
	{
		id: 2,
		title: 'Complete coding assignment',
		isCompleted: true,
	},
	{
		id: 3,
		title: 'Go for a run',
		isCompleted: false,
	},
	{
		id: 4,
		title: 'Read a book',
		isCompleted: true,
	},
	{
		id: 5,
		title: 'Write a blog post',
		isCompleted: false,
	},
	{
		id: 6,
		title: 'Attend a meeting',
		isCompleted: false,
	},
	{
		id: 7,
		title: 'Learn a new programming language',
		isCompleted: true,
	},
	{
		id: 8,
		title: 'Cook dinner',
		isCompleted: false,
	},
	{
		id: 9,
		title: 'Plan a weekend trip',
		isCompleted: true,
	},
	{
		id: 10,
		title: 'Practice mindfulness',
		isCompleted: false,
	},
];

export const Todo = builder.objectRef<ITodo>('Todo');

Todo.implement({
	description: 'This is a Todo object with ID, title, and completed boolean!',
	fields: (t) => ({
		id: t.exposeInt('id'),
		title: t.exposeString('title'),
		isCompleted: t.exposeBoolean('isCompleted', {
			description: 'Used for render a Checked status or not',
		}),
	}),
});
