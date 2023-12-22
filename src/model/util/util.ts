interface ArrayWithID<T> extends Array<T & { id: number }> {}

export const getNextID = <T extends { id: number }>(
	array: ArrayWithID<T>
): number => {
	return Math.max(...array.map((item) => item.id), 0) + 1;
};
