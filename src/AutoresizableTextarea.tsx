import { forwardRef } from 'react';

function AutoresizableTextarea(
	{
		min,
		max,
		value,
		rows,
		...props
	}: JSX.IntrinsicElements['textarea'] & { min?: number; max?: number },
	ref: any
) {
	value = String(value);

	if (!rows) {
		rows = value.split('\n').length;
		if (min && rows < min) {
			rows = min;
		}
		if (max && rows > max) {
			rows = max;
		}
	}

	return (
		<textarea
			rows={rows}
			onKeyDown={e => e.stopPropagation()}
			ref={ref}
			value={value}
			{...props}
		/>
	);
}

export default forwardRef(AutoresizableTextarea);
