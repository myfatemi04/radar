export type ItemProps = {
	id: string;
	name: string;
	description: string;
	target: Date | null;
	completedAt: Date | null;
	dependencies: string[];
};
