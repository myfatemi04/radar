export const commandsAndDescriptions = {
	'/t <name>': 'Create a new item',
	'/b': 'Navigate back',
	'/#': 'Navigate to item by label',
};

export default function CommandTable() {
	return (
		<table style={{ width: '100%' }}>
			<thead>
				<tr style={{ textAlign: 'left' }}>
					<th style={{ fontFamily: 'monospace', fontSize: '1rem' }}>Command</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{Object.entries(commandsAndDescriptions).map(
					([command, description]) => (
						<tr key={command}>
							<td style={{ fontFamily: 'monospace', marginRight: '1rem' }}>
								{command}
							</td>
							<td>{description}</td>
						</tr>
					)
				)}
			</tbody>
		</table>
	);
}
